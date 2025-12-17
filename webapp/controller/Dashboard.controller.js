sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, History) {
        "use strict";

        return Controller.extend("qualityportal.controller.Dashboard", {
            onInit: function () {
                var oViewModel = new JSONModel({
                    inspectionCount: 0,
                    resultCount: 0,
                    usageCount: 0
                });
                this.getView().setModel(oViewModel, "dashboard");

                // Route match handler to refresh counts
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteDashboard").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function () {
                this._fetchCounts();
            },

            _fetchCounts: function () {
                var oModel = this.getOwnerComponent().getModel("inspectionModel");
                var oViewModel = this.getView().getModel("dashboard");

                // Fetch Total Inspection Lots
                oModel.read("/ZBV_INSPECTION_QP/$count", {
                    success: function (sCount) {
                        oViewModel.setProperty("/inspectionCount", sCount);
                    }
                });

                // Fetch Pending Results (Example filter, adjust based on real data)
                // Assuming logic for "Pending Result Recording" might overlap with PENDING status or specific logic
                // For now, prompt implies 3 tiles calculated from live data.
                // We will filter by status 'PENDING' for results ? Or assume all pending?
                // Prompt says: "Usage Decision -> Allow decision only if status = PENDING".
                // Prompt says: "Result Recording -> For PENDING records".
                // So both relate to PENDING.

                // Let's count PENDING for Result Records
                oModel.read("/ZBV_INSPECTION_QP/$count", {
                    filters: [new sap.ui.model.Filter("UsageDecisionCode", sap.ui.model.FilterOperator.EQ, "PENDING")],
                    success: function (sCount) {
                        oViewModel.setProperty("/resultCount", sCount);
                    }
                });

                // For Usage Decision, it's also PENDING status that is relevant for action.
                // Maybe "Pending Decision" is the same count? Or implies Result Recorded but Decision not made?
                // Without a specific field for "ResultRecorded", we'll use the same PENDING count or leave it equal for now.
                oModel.read("/ZBV_INSPECTION_QP/$count", {
                    filters: [new sap.ui.model.Filter("UsageDecisionCode", sap.ui.model.FilterOperator.EQ, "PENDING")],
                    success: function (sCount) {
                        // Just as placeholder, using same filter.
                        oViewModel.setProperty("/usageCount", sCount);
                    }
                });
            },

            onPressInspectionLots: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteInspectionList");
            },

            onPressResultRecords: function () {
                // Navigate to list, possibly filtered (logic to be implemented in List controller)
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteInspectionList");
            },

            onPressUsageDecision: function () {
                // Navigate to list
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteInspectionList");
            },

            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteLogin", {}, true);
                }
            }
        });
    });
