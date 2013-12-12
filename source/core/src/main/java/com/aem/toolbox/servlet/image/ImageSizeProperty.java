package com.aem.toolbox.servlet.image;

import org.apache.commons.lang.StringUtils;

/**
 * ImageSize -
 *
 * @author Sebastien Bernard
 * @version $Id$
 */
public class ImageSizeProperty {
	private static final String REGEX = "(\\d+[x]{1}\\d+)";
	private int height;
	private int width;

	public static ImageSizeProperty parse(String imageSize) {
		checkArgument(imageSize);

		int parsedWidth = Integer.parseInt(StringUtils.substringBefore(imageSize, "x"));
		int parsedHeight = Integer.parseInt(StringUtils.substringAfter(imageSize, "x"));

		return new ImageSizeProperty(parsedWidth, parsedHeight);
	}

	private static void checkArgument(String imageSize) {
		if (imageSize == null) {
			throw new IllegalArgumentException("The image size cannot be null.");
		}

		if (!matchPattern(imageSize)) {
			throw new IllegalArgumentException(String.format("The string %s doesn't match the patter %s", imageSize, REGEX));
		}
	}

	private static boolean matchPattern(String imageSize) {
		return imageSize.matches(REGEX);
	}

	public ImageSizeProperty(int width, int height) {
		this.width = width;
		this.height = height;
	}

	public int getWidth() {
		return width;
	}

	public int getHeight() {
		return height;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof ImageSizeProperty)) return false;

		ImageSizeProperty imageSize = (ImageSizeProperty) o;

		if (height != imageSize.height) return false;
		if (width != imageSize.width) return false;

		return true;
	}

	@Override
	public int hashCode() {
		int result = height;
		result = 31 * result + width;
		return result;
	}

	@Override
	public String toString() {
		return String.format("%sx%s", width, height);
	}
}
