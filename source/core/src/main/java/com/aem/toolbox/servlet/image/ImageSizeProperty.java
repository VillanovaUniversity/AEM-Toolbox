package com.aem.toolbox.servlet.image;

import java.awt.*;

import org.apache.commons.lang.StringUtils;

/**
 * ImageSize -
 *
 * @author Sebastien Bernard
 * @version $Id$
 */
public class ImageSizeProperty {
	private static final String REGEX = "(\\d+[x]{1}\\d+)";
	private Dimension dimension;
	private String property;


	public static ImageSizeProperty parse(String imageSize) {
		checkArgument(imageSize);

		int parsedWidth = Integer.parseInt(StringUtils.substringBefore(imageSize, "x"));
		int parsedHeight = Integer.parseInt(StringUtils.substringAfter(imageSize, "x"));

		return new ImageSizeProperty(new Dimension(parsedWidth, parsedHeight), imageSize);
	}

	private static void checkArgument(String imageSize) {
		if (imageSize == null) {
			throw new NullPointerException("The image size cannot be null.");
		}

		if (!matchPattern(imageSize)) {
			throw new IllegalArgumentException(String.format("The string %s doesn't match the patter %s", imageSize, REGEX));
		}
	}

	private static boolean matchPattern(String imageSize) {
		return imageSize.matches(REGEX);
	}

	private ImageSizeProperty(Dimension dimension, String property) {
		this.dimension = dimension;
		this.property = property;
	}

	public Dimension getDimension() {
		return dimension;
	}

	public String getProperty() {
		return property;
	}
}
