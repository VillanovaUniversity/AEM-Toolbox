//create widget namespace
CQ.Ext.ns('AEM.Toolbox.Widgets.StructuredMultiList');

AEM.Toolbox.Widgets.StructuredMultiList.SlidesPanel = CQ.Ext.extend(CQ.form.Slideshow.SlidesPanel, {

	/**
	 * Constructor to create a new slides panel. This is the panel with the combobox.
	 */
	constructor: function(config) {

		var parentScope = this;


		var hiddenButtons = !config.maxSlides || config.maxSlides < 2;
		// lazy initialization does not work on Firefox for these buttons, so instantiating
		// them the old way ...
		var addButton = new CQ.Ext.Button({
			"itemId": "addButton",
			"xtype": "button",
			"text": "Add",
			hidden : hiddenButtons,
			"afterRender": function() {
				CQ.Ext.Button.prototype.afterRender.call(this);
				if (parentScope._width) {
					parentScope.adjustSelectorWidth(parentScope._width)
				}
			},
			"handler": function() {
				if (parentScope.onAddButton) {
					parentScope.onAddButton();
				}
			}
		});
		var removeButton = new CQ.Ext.Button({
			"itemId": "removeButton",
			"xtype": "button",
			"text": "Remove",
			hidden : hiddenButtons,
			"afterRender": function() {
				CQ.Ext.Button.prototype.afterRender.call(this);
				if (parentScope._width) {
					parentScope.adjustSelectorWidth(parentScope._width)
				}
			},
			"handler": function() {
				if (parentScope.onRemoveButton) {
					parentScope.onRemoveButton();
				}
			}
		});
		var upButton = new CQ.Ext.Button({
			"itemId": "upButton",
			"xtype": "button",
			"text": "Up",
			hidden : hiddenButtons,
			"afterRender": function() {
				CQ.Ext.Button.prototype.afterRender.call(this);
				if (parentScope._width) {
					parentScope.adjustSelectorWidth(parentScope._width)
				}
			},
			"handler": function() {
				if (parentScope.onUpButton) {
					parentScope.onUpButton();
				}
			}
		});
		var downButton = new CQ.Ext.Button({
			"itemId": "downButton",
			"xtype": "button",
			"text": "Down",
			hidden : hiddenButtons,
			"afterRender": function() {
				CQ.Ext.Button.prototype.afterRender.call(this);
				if (parentScope._width) {
					parentScope.adjustSelectorWidth(parentScope._width)
				}
			},
			"handler": function() {
				if (parentScope.onDownButton) {
					parentScope.onDownButton();
				}
			}
		});

		config = config || { };
		var defaults = {
			"layout": "table",
			"layoutConfig": {
				"columns": 5
			},
			"defaults": {
				"style": "padding: 3px;"
			},
			"minSize": 30,
			"maxSize": 30,
			"height": 30,
			"items": [
				{
					"itemId": "slideSelector",
					"xtype": "panel",
					"layout": "fit",
					"border": false,
					"height": 30,
					"hideBorders": true,
					"items": [
						{
							"itemId": "selector",
							"xtype": "selection",
							"type": "select",
							"listeners": {
								"selectionchanged": {
									"fn": function(comp, value) {
										if (this.onSlideChanged) {
											this.onSlideChanged(value);
										}
									},
									"scope": this
								}
							}
						}
					]
				},
				addButton,
				removeButton,
				upButton,
				downButton
			],
			"listeners": {
				"bodyresize": {
					"fn": function(comp, w, h) {
						this.adjustSelectorWidth(w);
					},
					"scope": this
				}
			}
		};

		CQ.Util.applyDefaults(config, defaults);
		//call superclass constructor.
		AEM.Toolbox.Widgets.StructuredMultiList.SlidesPanel.superclass.constructor.call(this, config);
	},

	adjustSelectorWidth: function(width) {
		if (width) {
			var selectorPanel = this.items.get("slideSelector");
			var addButton = this.items.get("addButton");
			var removeButton = this.items.get("removeButton");
			var upButton = this.items.get("upButton");
			var downButton = this.items.get("downButton");
			if (addButton.rendered && removeButton.rendered && upButton.rendered && downButton.rendered) {
				var selWidth = width
					- addButton.getEl().getWidth()
					- removeButton.getEl().getWidth()
					- upButton.getEl().getWidth()
					- downButton.getEl().getWidth();
				selectorPanel.setSize(selWidth, 30);
				var selector = selectorPanel.items.get("selector");
				selector.setSize(selWidth, addButton.getEl().getHeight());
			} else {
				this._width = width;
			}
		}
	},

	/**
	 * Will collapse the combobox.
	 */
	collapseSelect: function() {
		var selector = this.items.get("slideSelector").items.get("selector");
		selector.comboBox.collapse();
	}
});