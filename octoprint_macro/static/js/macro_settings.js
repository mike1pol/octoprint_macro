/*
 * View model for Sidebar Settings Macros
 *
 * Author: Mikhail Poluboyarinov
 * License: MIT
 */
$(function () {
    function MacroSettingsViewModel(parameters) {
        var self = this;
        self.settings = parameters[0];
        self.addMacro = function () {
            self.settings.settings.plugins.macro.macros.push({
                name: 'Macro',
                macro: '',
                type: 'default',
                active: true,
                dop: false
            });
        }
        self.bindFor = function (prefix, ctx) {
            return `${prefix}-${ctx.$index()}`;
        };
        self.removeMacro = function (macro) {
            self.settings.settings.plugins.macro.macros.remove(macro);
        }
        self.moveMacroUp = function (macro) {
            self.moveItemUp(self.settings.settings.plugins.macro.macros, macro)
        }

        self.moveMacroDown = function (macro) {
            self.moveItemDown(self.settings.settings.plugins.macro.macros, macro)
        }

        self.moveItemDown = function (list, item) {
            var i = list().indexOf(item);
            if (i < list().length - 1) {
                var rawList = list();
                list.splice(i, 2, rawList[i + 1], rawList[i]);
            }
        }
        self.getBtnClass = function (type) {
            return `btn-${typeof type === 'function' ? type() : type}`;
        }
        self.moveItemUp = function (list, item) {
            var i = list().indexOf(item);
            if (i > 0) {
                var rawList = list();
                list.splice(i - 1, 2, rawList[i], rawList[i - 1]);
            }
        }
    }
    OCTOPRINT_VIEWMODELS.push({
        construct: MacroSettingsViewModel,
        dependencies: ["settingsViewModel"],
        elements: ["#settings_plugin_macro"]
    });
});
