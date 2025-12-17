sap.ui.define([
    "sap/ui/core/UIComponent",
    "qualityportal/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("qualityportal.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            // Central Error Handling
            var oInspectionModel = this.getModel("inspectionModel");
            if (oInspectionModel) {
                oInspectionModel.attachRequestFailed(function (oEvent) {
                    var sMessage = "An error occurred";
                    try {
                        var oParams = oEvent.getParameters();
                        // Detailed error parsing can be added here
                    } catch (e) { }
                    // sap.m.MessageToast.show("Network Error: Please check connection.");
                });
            }
        }
    });
});
