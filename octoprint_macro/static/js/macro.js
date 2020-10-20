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
        function executeCommand (i, command) {
            setTimeout(function () {
                OctoPrint.control.sendGcode(command.toUpperCase().trim())
            }, i * 300);
        }
        self.executeMacro = function () {
            const macro = this.macro();
            const commands = macro.split('\n');
            for (let i = 0; i < commands.length; i += 1) {
                const command = commands[i];
                if (!command.includes(';;')) {
                    executeCommand(i, command);
                } else if (!command.startsWith(';;')) {
                    const idx = command.indexOf(';;');
                    const newCommand = command.slice(0, idx);
                    executeCommand(i, newCommand);
                }
            }
        }
        self.getClass = function () {
            var columns = this.settings.settings.plugins.macro.column();
            return `macro-column-${columns <= 0 || columns > 5 ? 1 : columns}`;
        }
        self.getBtnClass = function (type) {
            return `btn-${typeof type === 'function' ? type() : type}`;
        }
    }
    OCTOPRINT_VIEWMODELS.push({
        construct: MacroViewModel,
        dependencies: ["settingsViewModel", "loginStateViewModel", "connectionViewModel"],
        elements: ["#sidebar_plugin_macro"]
    });
});
