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
	@Test(expected = NullPointerException.class)
	public void testParseNull(){
		ImageSizeProperty.parse(null);
	}

	@Test(expected = IllegalArgumentException.class)
	public void testParseWrongExpression(){
		ImageSizeProperty.parse("blabla");
	}

	@Test(expected = IllegalArgumentException.class)
	public void testParseWrongExpression2(){
		ImageSizeProperty.parse("10xx");
	}

	@Test
	public void testParse() throws Exception {
		ImageSizeProperty imageSize = ImageSizeProperty.parse("10x20");
		assertEquals(10, imageSize.getDimension().width);
		assertEquals(20, imageSize.getDimension().height);
	}


}
