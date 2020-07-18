# coding=utf-8
from __future__ import absolute_import
import octoprint.plugin

class SidebarmacrosPlugin(octoprint.plugin.SettingsPlugin,
                          octoprint.plugin.AssetPlugin,
                          octoprint.plugin.TemplatePlugin):

	def get_settings_defaults(self):
		return dict(
			column = 1,
			macros = [
				dict(name="Home", macro="G28", active=True, type = "default")
			]
		)

	def get_settings_version(self):
		return 1

	def on_settings_migrate(self, target, current=None):
		if current is None or current < 1:
			new_macros = []
			self._logger.info(self._settings.get(['macros']))
			for macros in self._settings.get(['macros']):
				macros['type'] = "default"
				new_macros.append(macros)
			self._settings.set(['macros'], new_macros)
			self._settings.set(['column'], 1)

	def get_template_configs(self):
		return [
			dict(type="settings", custom_bindings=True, template="macro_settings.jinja2"),
			dict(type="sidebar", icon="rocket", custom_bindings=True, template="macro_sidebar.jinja2")
		]

	def get_assets(self):
		return dict(
			js=["js/macro.js", "js/macro_settings.js"],
			css=["css/macro.css"]
		)

	def get_update_information(self):
		return dict(
			sidebarmacros=dict(
				displayName="Macro Plugin",
				displayVersion=self._plugin_version,
				type="github_release",
				user="mike1pol",
				repo="octoprint_macro",
				current=self._plugin_version,
				pip="https://github.com/mike1pol/octoprint_macro/archive/{target_version}.zip"
			)
		)

def __plugin_load__():
	global __plugin_implementation__
	__plugin_implementation__ = SidebarmacrosPlugin()

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
	}

