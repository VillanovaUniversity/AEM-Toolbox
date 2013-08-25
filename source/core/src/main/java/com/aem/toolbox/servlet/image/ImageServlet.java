package com.aem.toolbox.servlet.image;

import java.awt.*;
import java.awt.geom.Rectangle2D;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServletResponse;

import com.day.cq.commons.ImageHelper;
import com.day.cq.commons.ImageResource;
import com.day.cq.wcm.commons.AbstractImageServlet;
import com.day.cq.wcm.foundation.Image;
import com.day.image.Layer;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceUtil;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.ComponentContext;

@SlingServlet(resourceTypes = {"sling/servlet/default"}, selectors = {"no.size.img", "size.img"})
@Properties(value = {
	@org.apache.felix.scr.annotations.Property(name = ImageServlet.PAGE_404_PROP_NAME, value = ImageServlet.DEFAULT_PAGE_404, propertyPrivate = false),
	@org.apache.felix.scr.annotations.Property(name = ImageServlet.VALID_DEVICES, cardinality = Integer.MAX_VALUE, value = {"phone", "tablet"}, propertyPrivate = false)
})
public class ImageServlet extends AbstractImageServlet {
	public static final String DEFAULT_PAGE_404 = "/404.html";
	public static final String PAGE_404_PROP_NAME = "default.page.404";
	public static final String VALID_DEVICES = "valid.devices";
	public static final String SKIP_RESIZING_SELECTOR = "no";
	private static final Set<String> SELECTORS = new HashSet<String>() {{
		add("no.size.img");
		add("size.img");
	}};

	private String pageNotFound;
	private Set<String> allowedSelectors = new HashSet<String>();

	@SuppressWarnings("UnusedDeclaration")
	protected void activate(ComponentContext context) {
		this.pageNotFound = (String) context.getProperties().get(PAGE_404_PROP_NAME);
		String[] devices = (String[]) context.getProperties().get(VALID_DEVICES);

		//build our allowed selectors
		for (String selector : SELECTORS) {
			allowedSelectors.add(selector);
			for (String device : devices) {
				allowedSelectors.add(selector + '.' + device);
			}
		}
	}

	@Override
	protected void doGet(SlingHttpServletRequest req, SlingHttpServletResponse res) throws javax.servlet.ServletException, IOException {
		//get our resource to validate exists
		Resource r = req.getResource();

		//if our url isn't valid or we don't have a resource, return 404
		if (!hasValidSelectors(req) || ResourceUtil.isNonExistingResource(r)) {
			res.setStatus(404);
			req.getRequestDispatcher(pageNotFound).include(req, res);
		} else {
			super.doGet(req, res);
		}
	}

	private boolean hasValidSelectors(SlingHttpServletRequest req) {
		//pull out our selectors
		String selectors = StringUtils.join(req.getRequestPathInfo().getSelectors(), '.');

		//return if our selectors are allowed
		return allowedSelectors.contains(selectors);
	}

	@Override
	protected Layer createLayer(ImageContext c)
		throws RepositoryException, IOException {
		// don't create the layer yet. handle everything later
		return null;
	}


	/**
	 * {@inheritDoc}
	 * <p/>
	 * Override default ImageResource creation to support assets
	 */
	@Override
	protected ImageResource createImageResource(Resource resource) {
		return new Image(resource);
	}

	@Override
	protected void writeLayer(SlingHttpServletRequest req,
	                          SlingHttpServletResponse resp,
	                          ImageContext c, Layer layer)
		throws IOException, RepositoryException {
		//pull out our selectors
		String[] selectors = req.getRequestPathInfo().getSelectors();

		//get whether or not we should apply sizing restrictions
		boolean applySizing = !SKIP_RESIZING_SELECTOR.equals(selectors[0]);

		//retrieve our resource properties
		ValueMap properties = c.resource.adaptTo(ValueMap.class);

		//get our property names holding the resizing configuration
		String propertyPrefix = selectors[selectors.length - 1];
		if (propertyPrefix == null || "img".equals(propertyPrefix)) {
			propertyPrefix = StringUtils.EMPTY;
		}

		//get our size properties from our resource
		int width = properties.get(propertyPrefix + "hardwidth", 0);
		int height = properties.get(propertyPrefix + "hardheight", 0);
		int maxWidth = properties.get(propertyPrefix + "maxwidth", 0);
		int maxHeight = properties.get(propertyPrefix + "maxheight", 0);
		int minWidth = properties.get(propertyPrefix + "minwidth", 0);
		int minHeight = properties.get(propertyPrefix + "minheight", 0);

		Image image = new Image(c.resource);
		if (!image.hasContent()) {
			resp.sendError(HttpServletResponse.SC_NOT_FOUND);
			return;
		}

		// get style and set constraints
		image.loadStyleData(c.style);

		// get pure layer
		layer = image.getLayer(false, false, false);
		boolean modified = false;

		if (layer != null) {
			// crop
			modified = image.crop(layer) != null;

			// rotate
			modified |= image.rotate(layer) != null;

			//resize our layer to conform to max/min dimensions.
			if (applySizing) {
				Layer resizedLayer;

				//if a width or height is provided, then we just want to size on that and not use max/min
				if (width > 0 || height > 0) {
					//if both width and height were provided, then we need to do some cropping logic
					if (width > 0 && height > 0) {
						//get our image dimensions
						float imageWidth = layer.getWidth();
						float imageHeight = layer.getHeight();

						//determine our desired aspect and image aspect
						float desiredAspect = width / height;
						float imageAspect = imageWidth / imageHeight;

						//if we already have the same aspect, resize as is
						if (imageAspect == desiredAspect) {
							resizedLayer = ImageHelper.resize(layer, new Dimension(width, height), new Dimension(0, 0), new Dimension(0, 0));
						} else {
							//if our image aspect is less than the desired, size on width and crop by height
							if (imageAspect < desiredAspect) {
								//resize on width
								resizedLayer = ImageHelper.resize(layer, new Dimension(width, 0), new Dimension(0, 0), new Dimension(0, 0));

								//we need to make sure we have a layer to work with so if our resized layer is null, lets go back to our original layer
								if (resizedLayer == null) {
									resizedLayer = layer;
								}

								//determine how much to take off the top and bottom of the image
								int cropSize = (resizedLayer.getHeight() - height) / 2;

								//crop our image
								resizedLayer.crop(new Rectangle2D.Double(0, cropSize, resizedLayer.getWidth(), resizedLayer.getHeight() - (cropSize * 2)));
							} else {
								//else lets size on height and crop by width
								resizedLayer = ImageHelper.resize(layer, new Dimension(0, height), new Dimension(0, 0), new Dimension(0, 0));

								//we need to make sure we have a layer to work with so if our resized layer is null, lets go back to our original layer
								if (resizedLayer == null) {
									resizedLayer = layer;
								}

								//determine how much to take off the left and right of the image
								int cropSize = (resizedLayer.getWidth() - width) / 2;

								//crop our image
								resizedLayer.crop(new Rectangle2D.Double(cropSize, 0, resizedLayer.getWidth() - (cropSize * 2), resizedLayer.getHeight()));
							}
						}
					} else {
						//we only have a width or height configured so we can just scale proportionally on whichever one is configured.
						resizedLayer = ImageHelper.resize(layer, new Dimension(width, height), new Dimension(0, 0), new Dimension(0, 0));
					}
				} else {
					//we don't have a width or height so lets use any max/min values that were configured.
					resizedLayer = ImageHelper.resize(layer, new Dimension(0, 0), new Dimension(minWidth, minHeight), new Dimension(maxWidth, maxHeight));
				}

				//if we have a resized layer then set it and mark modified
				if (resizedLayer != null) {
					layer = resizedLayer;
					modified = true;
				}
			}

			// apply diff if needed (because we create the layer inline)
			modified |= applyDiff(layer, c);
		}

		if (modified) {
			String mimeType = image.getMimeType();
			if (ImageHelper.getExtensionFromType(mimeType) == null) {
				// get default mime type
				mimeType = "image/png";
			}
			resp.setContentType(mimeType);
			layer.write(mimeType, mimeType.equals("image/gif") ? 255 : 1.0, resp.getOutputStream());
		} else {
			// do not re-encode layer, just spool
			Property data = image.getData();
			InputStream in = data.getStream();
			resp.setContentLength((int) data.getLength());
			resp.setContentType(image.getMimeType());
			IOUtils.copy(in, resp.getOutputStream());
			in.close();
		}
		resp.flushBuffer();
	}
}
