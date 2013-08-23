//create widget namespace
CQ.Ext.ns('AEM.Toolbox.Widgets.rte.plugins');

AEM.Toolbox.Widgets.rte.plugins.RTEFormattingPlugin = CQ.Ext.extend(CQ.form.rte.plugins.ParagraphFormatPlugin, {
	cachedBlacklist: null,

	constructor: function(editorKernel) {
		AEM.Toolbox.Widgets.rte.plugins.RTEFormattingPlugin.superclass.constructor.call(this, editorKernel);
	},

	getFormatId: function(dom) {
		//create our dom format id
		var domFormatId = this.createFormatId(dom.tagName, dom.classList);

		//get our formats and loop until we find the correct one.
		var formats = this.getFormats();
		var formatCnt = formats.length;
		for (var f = 0; f < formatCnt; f++) {
			//get current format definition
			var formatDef = formats[f];

			//create our format id
			var formatId = this.createFormatId(formatDef.tag, formatDef.classNames);

			//if this format matches the dom element passed then return the format id
			if (formatId == domFormatId) {
				return formatId;
			}
		}
		return null;
	},

	getFormats: function() {
		var com = CQ.form.rte.Common;
		if (this.cachedFormats == null) {
			this.cachedFormats = this.config.formats || { };
			com.removeJcrData(this.cachedFormats);
			this.cachedFormats = com.toArray(this.cachedFormats, null, null);
		}
		return this.cachedFormats;
	},

	getFormatById: function(formats, id) {
		var formatCnt = formats.length;
		for (var f = 0; f < formatCnt; f++) {
			//get current format definition
			var formatDef = formats[f];

			//create our format id
			var formatId = this.createFormatId(formatDef.tag, formatDef.classNames);

			//if our id matches this format then return it.
			if (formatId == id) {
				return formats[f];
			}
		}
		return null;
	},

	initializeUI: function(tbGenerator) {
		var plg = CQ.form.rte.plugins;
		var ui = AEM.Toolbox.Widgets.rte.ui;
		if (this.isFeatureEnabled("paraformat")) {
			this.formatUI = new ui.RTEFormattingUI("paraformat", this, null, this.getFormats());
			tbGenerator.addElement("paraformat", plg.Plugin.SORT_PARAFORMAT, this.formatUI, 10);
		}
	},

	execute: function(cmd) {
		if (this.formatUI) {
			var formatId = this.formatUI.getSelectedFormat();
			if (formatId && formatId != "--") {
				this.editorKernel.relayCmd("rteformattingcommand", this.getFormatById(this.getFormats(), formatId));
			}
		}
	},

	updateState: function(selDef) {
		if (!this.formatUI || !this.formatUI.getExtUI()) {
			return;
		}

		//call superclass method.
		AEM.Toolbox.Widgets.rte.plugins.RTEFormattingPlugin.superclass.updateState.call(this, selDef);

		//if our superclass method couldn't find a selection don't disable, instead show select option.
		var selectorDom = this.formatUI.getExtUI().dom;
		if (!selectorDom.disabled && selectorDom.selectedIndex > -1) {
			return;
		}

		//determine if the tag selected is blacklisted
		var hasBlacklistedTag = false;
		var nodeList = selDef.nodeList;
		var nodeToCheck = nodeList.commonAncestor;

		while (nodeToCheck) {
			if (nodeToCheck.nodeType == 1) {
				if (this.isBlacklisted(nodeToCheck)) {
					hasBlacklistedTag = true;
					break;
				}
			}
			nodeToCheck = nodeToCheck.parentNode;
		}
		// check first level nodes also, if no parent format has been detected
		if (!hasBlacklistedTag) {
			var nodeCnt = nodeList.nodes.length;
			for (var nodeIndex = 0; nodeIndex < nodeCnt; nodeIndex++) {
				nodeToCheck = nodeList.nodes[nodeIndex];
				if (nodeToCheck.dom.nodeType == 1) {
					if (this.isBlacklisted(nodeToCheck)) {
						hasBlacklistedTag = true;
						break;
					}
				}
			}
		}

		//if we don't have a blacklisted tag selected, enable out dropdown and select default option.
		if (!hasBlacklistedTag) {
			selectorDom.disabled = false;
			selectorDom.selectedIndex = 0;
		}
	},

	createFormatId: function(tag, classNames) {
		var formatId = tag;
		if (classNames != null) {
			for (var i = 0; i < classNames.length; i++) {
				formatId += classNames[i];
			}
		}
		return formatId.toLowerCase();
	},

	isBlacklisted: function(dom) {
		var tagName = dom.tagName.toLowerCase();
		var blacklist = this.getBlacklist();
		var blacklistCnt = blacklist.length;
		for (var i = 0; i < blacklistCnt; i++) {
			var blacklistDef = blacklist[i];
			if (blacklistDef.tag && (blacklistDef.tag == tagName)) {
				return true;
			}
		}
		return false;
	},

	getBlacklist: function() {
		var com = CQ.form.rte.Common;
		if (this.cachedBlacklist == null) {
			this.cachedBlacklist = this.config.blacklist || { };
			com.removeJcrData(this.cachedBlacklist);
		}
		return this.cachedBlacklist;
	}
});

//register plugin
CQ.form.rte.plugins.PluginRegistry.register("formatting", AEM.Toolbox.Widgets.rte.plugins.RTEFormattingPlugin);