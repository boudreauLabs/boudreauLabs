// Global data available through Handlebars templates
const cfg = require( '../../../gulp-config.json' );

module.exports = {
  production: process.env.ELEVENTY_PROD,							// Flag used in layouts to point scripts to minified files
  root: cfg.paths.dist, 											// Used to calculate the relative-to-root path of the project
  showStatus: cfg.show_status,										// Display component and foundation statuses
  uiScriptName: cfg.paths.scripts.output_name,				// File name for UI Kit script
  uiVendorScriptName: cfg.paths.scripts.vendor.output_name 	// File name for UI Kit vendor script
};
