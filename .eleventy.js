let path = require('path');
let Handlebars = require('handlebars');
let hbHelpers = require('@jaredwray/fumanchu').handlebarHelpers;
let htmlmin = require('html-minifier');
let pretty = require('pretty');
hbHelpers({ handlebars: Handlebars });

module.exports = function(eleventyConfig) {
  /* ==================== */
  /* Define Libraries   */
  /* ==================== */
  // Set Handlebars as compile engine for defined templateFormats below
  eleventyConfig.setLibrary('hbs', Handlebars);

  /* ==================== */
  /* Handlebar Helpers  */
  /* ==================== */
  /*
   * Large collection of a wide variety of Handlebars helpers.
   * Make sure to include the proper collection(s) when importing this library
   * Full list of helpers: https://github.com/jaredwray/fumanchu
   */
  eleventyConfig.addHandlebarsHelper(hbHelpers);

  /*
   * Calculates the relative path back to root for project assets and links
   * @param {object} options - Handlebars option parameter from helper function
   */
  eleventyConfig.addHandlebarsHelper('root', function(options) {
    var pagePath = path.dirname(options.data.root.page.outputPath);
    var rootPath = path.join(process.cwd(), './build');
    var relativePath = path.relative(pagePath, rootPath);

    if (relativePath.length == 0) {
      relativePath += '.';
    }

    return relativePath;
  });

  // eleventyConfig.addHandlebarsHelper('breaklines', function(text) {
  //     text = Handlebars.Utils.escapeExpression(text);
  //     text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
  //     return new Handlebars.SafeString(text);
  // });

  // eleventyConfig.addHandlebarsHelper('hextorgb', function(color) {
  //     color = Handlebars.Utils.escapeExpression(color);
  //     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  //     return result ? 'rgb(' + ( parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16)) + ')' : null;
  // });

  /* ==================== */
  /* Post Processing    */
  /* ==================== */
  if (process.env.ELEVENTY_PROD) {

     // Minify compiled HTML
     // https://www.npmjs.com/package/html-minifier#options-quick-reference
     eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
       if( outputPath.endsWith('.html') ) {
         let minified = htmlmin.minify(content, {
           useShortDoctype: true,
           removeComments: true,
           collapseWhitespace: true,
           minifyJS: true
         });
         return minified;
       }

       return content;
     });

    } else {

      // Keep your sanity! Run compiled HTML through prettify formatter
      // https://www.npmjs.com/package/pretty#options
      eleventyConfig.addTransform('htmlprettify', function(content, outputPath) {
        if( outputPath.endsWith('.html') ) {
          let prettified = pretty(content, {
            indent_char: ' ',
            indent_size: 2
          });
          return prettified;
        }

        return content;
      });

  }

  /* ==================== */
  /* Layouts Aliases    */
  /* ==================== */
  eleventyConfig.addLayoutAlias('default',        'base.hbs');
  // eleventyConfig.addLayoutAlias('article',        'frontoffice-article.hbs');


  /* ==================== */
  /* Base Configuration */
  /* ==================== */
  eleventyConfig.setWatchThrottleWaitTime(100);

  return {
    dir: {
      input: 'src/site',
      output: 'build/',
      includes: '_includes/',
      layouts: '_layouts/', // Relative to input directory.
      data: '_data/'        // Relative to input directory.
    },
    templateFormats: [ 'hbs' ],
    htmlTemplateEngine: 'hbs',
    passthroughFileCopy: false
  };
}
