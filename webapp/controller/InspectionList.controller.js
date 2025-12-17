sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "qualityportal/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, Filter, FilterOperator, formatter) {
        "use strict";

        return Controller.extend("qualityportal.controller.InspectionList", {
            formatter: formatter,

            onInit: function () {
            },

            onSearch: function (oEvent) {
                var sQuery = oEvent.getParameter("query");
                var oFilter = null;
                if (sQuery) {
                    oFilter = new Filter("InspectionLot", FilterOperator.Contains, sQuery);
                }
                var oBinding = this.byId("inspectionTable").getBinding("items");
                oBinding.filter(oFilter ? [oFilter] : []);
            },

            onListItemPress: function (oEvent) {
                var oItem = oEvent.getSource();
                var sPath = oItem.getBindingContext("inspectionModel").getPath();
                var sInspectionLot = oItem.getBindingContext("inspectionModel").getProperty("InspectionLot");

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // Navigate with InspectionLot parameter
                oRouter.navTo("RouteResultRecording", {
                    InspectionLot: sInspectionLot
                });
            },

            onRecordPress: function (oEvent) {
                // Same logic as item press, but specific button
                var oItem = oEvent.getSource().getParent();
                var sInspectionLot = oItem.getBindingContext("inspectionModel").getProperty("InspectionLot");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteResultRecording", {
                    InspectionLot: sInspectionLot
                });
            },

            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteDashboard", {}, true); // Back to Dashboard
                }
            }
        });
    });
