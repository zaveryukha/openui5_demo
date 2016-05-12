sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
   "use strict";
   return Controller.extend("t1.controller.main", {
    onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
    onOpenDialog : function () {
		  this.getOwnerComponent().helloDialog.open(this.getView());
		}
   });
});
