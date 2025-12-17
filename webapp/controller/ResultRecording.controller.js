sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "qualityportal/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, MessageToast, MessageBox, formatter) {
        "use strict";

        return Controller.extend("qualityportal.controller.ResultRecording", {
            formatter: formatter,

            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteResultRecording").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                var sInspectionLot = oEvent.getParameter("arguments").InspectionLot;
                this.getView().bindElement({
                    path: "/ZBV_INSPECTION_QP('" + sInspectionLot + "')",
                    model: "inspectionModel"
                });
            },

            _validateStock: function () {
                var oContext = this.getView().getBindingContext("inspectionModel");
                var iUnrestricted = parseInt(oContext.getProperty("UnrestrictedStock")) || 0;
                var iBlocked = parseInt(oContext.getProperty("BlockedStock")) || 0;
                var iProduction = parseInt(oContext.getProperty("ProductionStock")) || 0;
                var iLotQty = parseInt(oContext.getProperty("LotQuantity")) || 0;

                var iSum = iUnrestricted + iBlocked + iProduction;

                if (iSum !== iLotQty) {
                    return false;
                }
                return true;
            },

            onSave: function () {
                var oModel = this.getView().getModel("inspectionModel");
                if (oModel.hasPendingChanges()) {
                    oModel.submitChanges({
                        success: function () {
                            MessageToast.show("Data saved successfully.");
                        },
                        error: function () {
                            MessageToast.show("Error saving data.");
                        }
                    });
                } else {
                    MessageToast.show("No changes to save.");
                }
            },

            onApprove: function () {
                if (!this._validateStock()) {
                    MessageBox.error("Sum of stocks must equal Lot Quantity before decision.");
                    return;
                }

                this._updateUsageDecision("A");
            },

            onReject: function () {
                if (!this._validateStock()) {
                    MessageBox.error("Sum of stocks must equal Lot Quantity before decision.");
                    return;
                }

                this._updateUsageDecision("R");
            },

            _updateUsageDecision: function (sDecision) {
                var oModel = this.getView().getModel("inspectionModel");
                var oContext = this.getView().getBindingContext("inspectionModel");
                var sPath = oContext.getPath();

                var oData = {
                    UsageDecisionCode: sDecision
                };

                sap.ui.core.BusyIndicator.show();
                oModel.update(sPath, oData, {
                    success: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Usage Decision Updated: " + sDecision);
                        // Since status changed, view bindings (buttons visibility) should update automatically if UI5 detects change.
                        // But usually update doesn't automatically reflect local property Binding if not returned. 
                        // We might need to refresh or manually set local property if using TwoWay binding (which we set in manifest).
                        // TwoWay binding should update model if we used Inputs. But UsageDecision was updated via .update call.
                        // We should refresh or set local property.
                        oModel.refresh();
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.error("Error updating Usage Decision.");
                    }
                });
            },

            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteInspectionList", {}, true);
                }
            }
        });
    });
