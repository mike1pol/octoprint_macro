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
            var i=-1;
            
            function replaceParams(match) {
               i++;
               return self.parameters()[i]["value"];
            }
            
            expanded = self.macro.replace(paramObjRegex, replaceParams)
            expanded = expanded.replace(/(?:\r\n|\r|\n)/g, " ");
            
            OctoPrint.control.sendGcode(expanded);
         }
    }
    OCTOPRINT_VIEWMODELS.push({
        construct: MacroViewModel,
        dependencies: ["settingsViewModel", "loginStateViewModel", "connectionViewModel"],
        elements: ["#sidebar_plugin_macro"]
    });
});
