package com.aem.toolbox.servlet.image;


import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * ImageSizeTest -
 *
 * @author Sebastien Bernard
 * @version $Id$
 */
public class ImageSizePropertyTest {
	@Test
	public void testParse() throws Exception {
		ImageSizeProperty imageSize = ImageSizeProperty.parse("10x20");
		assertEquals(10, imageSize.getWidth());
		assertEquals(20, imageSize.getHeight());
	}


}
