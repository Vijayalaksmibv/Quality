sap.ui.define([], function () {
    "use strict";

    return {

        statusState: function (sStatus) {
            if (sStatus === "A") {
                return "Success";
            } else if (sStatus === "R") {
                return "Error";
            } else if (sStatus === "PENDING") {
                return "Warning";
            }
            return "None";
        }
    };
});
