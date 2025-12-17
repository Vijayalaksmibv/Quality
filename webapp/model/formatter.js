sap.ui.define([], function () {
    "use strict";

    return {

        statusState: function (sStatus) {
            if (!sStatus) return "None";
            sStatus = sStatus.toUpperCase();
            if (sStatus === "A") {
                return "Success";
            } else if (sStatus === "R") {
                return "Error";
            } else if (sStatus === "PENDING") {
                return "Warning";
            }
            return "None";
        },

        resolveStatusState: function (sStatus1, sStatus2) {
            var sStatus = sStatus1 || sStatus2;
            return this.statusState(sStatus);
        }
    };
});
