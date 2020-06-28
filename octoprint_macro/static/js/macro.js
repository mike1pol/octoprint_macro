/*
 * View model for Sidebar Macros
 *
 * Author: Mikhail Poluboyarinov
 * License: MIT
 */
$(function () {
    function MacroViewModel(parameters) {
        var self = this;
        self.settings = parameters[0];
        self.loginState = parameters[1];
        self.connectionState = parameters[2];
        self.isActive = function () {
            return self.connectionState.isOperational() && self.loginState.isUser();
        }
        self.executeMacro = function() {
            OctoPrint.control.sendGcode(this.macro());
         }
    }
    OCTOPRINT_VIEWMODELS.push({
        construct: MacroViewModel,
        dependencies: ["settingsViewModel", "loginStateViewModel", "connectionViewModel"],
        elements: ["#sidebar_plugin_macro"]
    });
});
