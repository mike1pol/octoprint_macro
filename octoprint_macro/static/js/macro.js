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
		self.terminal = parameters[3]; //Hooks into the Terminal Tab
        self.isActive = function (data) {
            const dop = data.dop();
            if (dop && self.connectionState.isPrinting()) {
                return false;
            }
            return self.connectionState.isOperational() && self.loginState.isUser();
        }
        function executeCommands(commands) {
            var splitCommands = commands.split("\n'");     
            var len = splitCommands.length;
            for(var i=0;i<len;i++){
                self.terminal.command(splitCommands[i]);
                self.terminal.sendCommand();
				}
        }
        self.executeMacro = function () {
            const macro = this.macro();
            const commands = macro.split('\n');
            for (let i = 0; i < commands.length; i += 1) {
                const command = commands[i];
                if (!command.includes(';;')) {
					executeCommands(command);
                } else if (!command.startsWith(';;')) {
                    const idx = command.indexOf(';;');
                    const newCommand = command.slice(0, idx);
                    executeCommands(newCommand);
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
        dependencies: ["settingsViewModel", "loginStateViewModel", "connectionViewModel", "terminalViewModel"],
        elements: ["#sidebar_plugin_macro"]
    });
});
