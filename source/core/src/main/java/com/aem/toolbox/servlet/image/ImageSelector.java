package com.aem.toolbox.servlet.image;

/**
 * ImageSelector -
 *
 * @author Sebastien Bernard
 * @version $Id$
 */
public enum ImageSelector {
	NO_SIZE("no.size.img"),
	SIZE("size.img");

	private final String value;

	private ImageSelector(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	@Override
	public final String toString() {
		return value;
	}
}
