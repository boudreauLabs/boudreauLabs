let path = require('path');
let Handlebars = require('handlebars');
let hbHelpers = require('@jaredwray/fumanchu').handlebarHelpers;
let htmlmin = require('html-minifier');
let Image = require("@11ty/eleventy-img");
let pretty = require('pretty');

const cfg = require( './gulp-config.json' );
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

  /* ================== */
  /* 11ty Image Plugin  */
  /* ================== */
  /*
   * 11ty Image plugin docs
   * https://www.11ty.dev/docs/plugins/image/
   */
	function imageShortcode(src, alt, sizes, modifier) {
    // console.log(`Generating image(s) from:  ${src}`)
    // Assign default size if not defined
    sizes = typeof sizes == 'string' ? sizes : cfg.plugins.eleventyImages.sizes;
		let options = {
			widths: cfg.plugins.eleventyImages.widths,
			formats: cfg.plugins.eleventyImages.formats,
			urlPath: cfg.plugins.eleventyImages.urlPath,
			outputDir: cfg.plugins.eleventyImages.outputDir,
      svgAllowUpscale: false,
			filenameFormat: function (id, src, width, format, options) {
				const extension = path.extname(src)
				const name = path.basename(src, extension)
				return `${name}-${width}w.${format}`
			}
		}
    let hideImg = false;

		// generate images
		Image(src, options)

    if (alt == 'hidden') {
      alt = ''
      hideImg = true
    }

    // Image attributes
		let imageAttributes = {
      alt,
			sizes,
			loading: "lazy",
			decoding: "async",
		}

    if (hideImg) {
      imageAttributes['aria-hidden'] = true
    }

    // Add modifier class if available
    if (typeof modifier !== undefined) {
      imageAttributes.class = modifier
    }

    // get metadata
		metadata = Image.statsSync(src, options)
		return Image.generateHTML(metadata, imageAttributes)
	}
  /*
   * Handlebar useage
   * {{{image
   *    @src        source file to process
   *    @alt        image alt text | Optionaly set to 'hidden' to make it invisible to screen readers
   *    @sizes      Optional | image tag sizes attribute | Defualts to '(min-width: 1024px) 100vw, 50vw'
   *    @modifier   Optional | image class attibute
   * }}}
   * Example: {{{image "path/to/sorce/file.ext" "photo alt" "image size:optional" 'image class:optional'}}}
   */
  eleventyConfig.addShortcode('image', imageShortcode)



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
