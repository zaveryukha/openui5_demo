sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"t1/controller/HelloDialog",
	"sap/ui/Device"
], function (UIComponent, JSONModel, HelloDialog, Device) {
	"use strict";

	return UIComponent.extend("t1.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {

// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

// set data model
			var oData = {
				recipient: {
					name: "World"
				}
			};
			var oModel = new JSONModel(oData);
			this.setModel(oModel);
			// disable batch grouping for v2 API of the northwind service
			this.getModel("invoice").setUseBatch(false);
			// set device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");
// set dialog
			this.helloDialog = new HelloDialog();
// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});

});
