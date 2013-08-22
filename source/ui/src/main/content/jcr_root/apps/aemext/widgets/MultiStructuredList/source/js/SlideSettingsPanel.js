//create widget namespace
CQ.Ext.ns('AEMEXT.Widgets.MultiStructuredList');

AEMEXT.Widgets.MultiStructuredList.SlideSettingsPanel = CQ.Ext.extend(CQ.Ext.Panel, {

	/**
	 * Constructor to create our slide settings panel.
	 */
	constructor: function(config) {
		//be sure our config is an object.
		config = config || { };

		//define the default configuration for our panel
		var defaults = {
			'autoScroll': true,
			'labelWidth': 130,
			'bodyStyle': 'padding: 15px; padding-right: 0;',
			'header': true,
			'xtype': 'panel',
			'layout': 'form',
			'autoHeight': true,
			'items': []
		};

		//apply our defaults to the configuration
		CQ.Util.applyDefaults(config, defaults);

		//call our superclass constructor.
		AEMEXT.Widgets.MultiStructuredList.SlideSettingsPanel.superclass.constructor.call(this, config);
	},

	/**
	 * Init our slide settings panel
	 */
	initComponent: function() {
		//call our superclass init
		AEMEXT.Widgets.MultiStructuredList.SlideSettingsPanel.superclass.initComponent.call(this);
	},

	/**
	 * Called after the ui renders the settings panel.
	 */
	afterRender: function() {
		//call superclass afterRender
		AEMEXT.Widgets.MultiStructuredList.SlideSettingsPanel.superclass.afterRender.call(this);

		//set the visibility mode for our panel
		this.el.setVisibilityMode(CQ.Ext.Element.DISPLAY);
		this.body.setVisibilityMode(CQ.Ext.Element.DISPLAY);
	},

	/**
	 * Will validate our slide settings panel and return a boolean result.
	 */
	validate: function() {
		//validate each field and if any fails then return false.
		for (var i = 0; i < this.items.keys.length; i++) {
			var field = this.items.get(this.items.keys[i]);
			if (!field.validate()) {
				return false;
			}
		}

		//all fields passed, return true
		return true;
	},

	/**
	 * Will set a setting value based on the id passed.
	 * @param settingId    The setting id to set.
	 * @param settingValue The value to set.
	 */
	setSettingValue: function(settingId, settingValue) {
		var field = this.items.get(settingId);
		field.setValue(settingValue ? settingValue : "");
	},

	/**
	 * Will get a setting value based on the id passed.
	 * @param settingId The setting id to get.
	 */
	getSettingValue: function(settingId) {
		var field = this.items.get(settingId);
		return field.getValue();
	},

	/**
	 * Will disable all form fields.
	 */
	disableFormElements: function() {
		for (var i = 0; i < this.items.keys.length; i++) {
			this.items.get(this.items.keys[i]).disable();
		}
	},

	/**
	 * Will enable all form fields.
	 */
	enableFormElements: function() {
		for (var i = 0; i < this.items.keys.length; i++) {
			this.items.get(this.items.keys[i]).enable();
		}
	}

});