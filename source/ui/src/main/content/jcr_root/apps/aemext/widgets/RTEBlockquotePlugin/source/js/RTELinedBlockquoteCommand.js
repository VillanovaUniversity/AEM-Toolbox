//create widget namespace
CQ.Ext.ns('AEMEXT.Widgets.rte.commands');

AEMEXT.Widgets.rte.commands.RTELinedBlockquoteCommand = CQ.Ext.extend(AEMEXT.Widgets.rte.commands.RTEBlockquoteCommand, {

	isCommand:function (cmdStr) {
		return (cmdStr.toLowerCase() == "rtelinedblockquotecommand");
	},

	removeBlockquoteStructure:function (blockquote) {
		//if we don't have a node list, return
		if (blockquote == null) {
			return;
		}

		//check first child and make sure it is a <p/> tag
		if (!blockquote.childNodes || !blockquote.childNodes[0]) {
			return;
		}

		//get first child and process
		var firstChild = blockquote.childNodes[0];
		if (firstChild.tagName.toLowerCase() == "p") {
			firstChild.className = "";
		}
	},

	addBlockquoteStructure:function (blockquote) {
		//if we don't have a node list, return
		if (blockquote == null) {
			return;
		}

		//check first child and make sure it is a <p/> tag
		if (!blockquote.childNodes || !blockquote.childNodes[0]) {
			return;
		}

		//get first child and process
		var firstChild = blockquote.childNodes[0];
		if (firstChild.tagName.toLowerCase() == "p") {
			firstChild.className = "lined";
		}
	},

	isCorrectBlockquoteStructure:function (nodeList) {
		//if we don't have a node list, return false
		if (nodeList == null) {
			return false;
		}

		//check first child and make sure it is a <p/> tag with no class
		if (!nodeList.childNodes || !nodeList.childNodes[0]) {
			return false;
		}

		//get first child and check
		var firstChild = nodeList.childNodes[0];
		return firstChild.nodeType == 1 && firstChild.tagName.toLowerCase() == "p" && firstChild.className == "lined";
	}
});

// register command
CQ.form.rte.commands.CommandRegistry.register("rtelinedblockquotecommand", AEMEXT.Widgets.rte.commands.RTELinedBlockquoteCommand);