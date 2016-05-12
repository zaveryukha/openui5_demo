sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
   "use strict";
   return Controller.extend("t1.controller.main", {
    onOpenDialog : function () {
		  this.getOwnerComponent().helloDialog.open(this.getView());
		}
   });
});
