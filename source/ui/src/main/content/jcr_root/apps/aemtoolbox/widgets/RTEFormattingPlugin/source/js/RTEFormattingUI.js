//create widget namespace
CQ.Ext.ns('AEM.Toolbox.Widgets.rte.ui');

AEM.Toolbox.Widgets.rte.ui.RTEFormattingUI = CQ.Ext.extend(CQ.form.rte.ui.TbParaFormatter, {
	constructor: function(id, plugin, tooltip, formats) {
		AEM.Toolbox.Widgets.rte.ui.RTEFormattingUI.superclass.constructor.call(this, id, plugin, tooltip, formats);
	},

	createFormatOptions: function() {
		var htmlCode = "<option value=\"--\">-- Select Format --</option>";
		if (this.formats) {
			var formatCnt = this.formats.length;
			for (var f = 0; f < formatCnt; f++) {
				//get text
				var text = this.formats[f].description;

				//get value
				var value = this.plugin.createFormatId(this.formats[f].tag, this.formats[f].classNames);

				//create our option
				htmlCode += "<option value=\"" + value + "\">" + text + "</option>";
			}
		}
		return htmlCode;
	}
});