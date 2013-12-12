package com.aem.toolbox.servlet.image;


import java.awt.Dimension;

/**
 * Image -
 *
 * @author Sebastien Bernard
 * @version $Id$
 */
public class ImageDimensions {
	private Dimension base;
	private Dimension max;
	private Dimension min;

	public ImageDimensions(Dimension base) {
		if (base == null) {
			throw new NullPointerException("The base dimension cannot be null");
		}
		this.base = base;
		this.max = new Dimension();
		this.min = new Dimension();
	}

	public void setMax(int width, int height) {
		max = new Dimension(width, height);
	}

	public void setMin(int width, int height) {
		min = new Dimension(width, height);
	}

	public Dimension getBase() {
		return base;
	}

	public Dimension getMax() {
		return max;
	}

	public Dimension getMin() {
		return min;
	}

	public float getBaseAspectRatio() {
		return base.width / base.height;
	}

	public boolean canBeRezised() {
		return base.width > 0 || base.height > 0;
	}

	public boolean canBeCropped() {
		return base.width > 0 && base.height > 0;
	}
}
