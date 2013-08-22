//create widget namespace
CQ.Ext.ns('AEMEXT.Widgets.rte.plugins');

AEMEXT.Widgets.rte.plugins.RTEBlockquotePlugin = CQ.Ext.extend(CQ.form.rte.plugins.Plugin, {
	/**
	 * @private
	 */
	blockquoteUI:null,

	/**
	 * @private
	 */
	linedBlockquoteUI:null,

	constructor:function (editorKernel) {
		AEMEXT.Widgets.rte.plugins.RTEBlockquotePlugin.superclass.constructor.call(this, editorKernel);
	},

	getFeatures:function () {
		return [ "blockquote", "linedblockquote" ];
	},

	initializeUI:function (tbGenerator) {
		var ui = CQ.form.rte.ui;
		if (this.isFeatureEnabled("blockquote")) {
			this.blockquoteUI = new ui.TbElement("blockquote", this, true, this.getTooltip("blockquote"));
			tbGenerator.addElement("blockquote", 1100, this.blockquoteUI, 110);
		}
		if (this.isFeatureEnabled("linedblockquote")) {
			this.linedBlockquoteUI = new ui.TbElement("linedblockquote", this, true, this.getTooltip("linedblockquote"));
			tbGenerator.addElement("blockquote", 1200, this.linedBlockquoteUI, 110);
		}
	},

	notifyPluginConfig:function (pluginConfig) {
		// configuring "blockquote" dialog
		pluginConfig = pluginConfig || { };
		var defaults = {
			"tooltips":{
				"blockquote":{
					"title":CQ.I18n.getMessage("Blockquote"),
					"text":CQ.I18n.getMessage("Wrap selection as a blockquote.")
				},
				"linedblockquote":{
					"title":CQ.I18n.getMessage("Pull Quote"),
					"text":CQ.I18n.getMessage("Wrap selection as a pull quote.")
				}
			}
		};
		CQ.Util.applyDefaults(pluginConfig, defaults);
		this.config = pluginConfig;
	},

	execute:function (cmd, value, options) {
		if (cmd == "blockquote" && this.blockquoteUI) {
			this.editorKernel.relayCmd("rteblockquotecommand", this.blockquoteUI.getExtUI().pressed);
		}
		if (cmd == "linedblockquote" && this.linedBlockquoteUI) {
			this.editorKernel.relayCmd("rtelinedblockquotecommand", this.linedBlockquoteUI.getExtUI().pressed);
		}
	},

	updateState:function (selDef) {
		if (this.blockquoteUI && this.blockquoteUI.getExtUI()) {
			//set button state.
			this.blockquoteUI.getExtUI().toggle(this.editorKernel.queryState("rteblockquotecommand", selDef));
		}
		if (this.linedBlockquoteUI && this.linedBlockquoteUI.getExtUI()) {
			//set button state.
			this.linedBlockquoteUI.getExtUI().toggle(this.editorKernel.queryState("rtelinedblockquotecommand", selDef));
		}
	}
});

//register plugin
CQ.form.rte.plugins.PluginRegistry.register("blockquote", AEMEXT.Widgets.rte.plugins.RTEBlockquotePlugin);