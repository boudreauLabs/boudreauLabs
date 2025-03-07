let path = require('path');
const handlebars = require('handlebars');
const handlebarsPlugin = require("@11ty/eleventy-plugin-handlebars");
const { helpers } = require('@jaredwray/fumanchu');
const eleventyImageTransformPlugin = require("@11ty/eleventy-img");

let htmlmin = require('html-minifier');
let pretty = require('pretty');

const cfg = require( './gulp-config.json' );
helpers({ handlebars: handlebars });

module.exports = function(eleventyConfig) {
  // Handlebar plugin
  // https://www.11ty.dev/docs/languages/handlebars/
	eleventyConfig.addPlugin(handlebarsPlugin, {
		eleventyLibraryOverride: handlebars,
	});

  /*
   * Calculates the relative path back to root for project assets and links
   * @param {object} options - Handlebars option parameter from helper function
   */
  eleventyConfig.addShortcode('root', function(options) {
    let pagePath = path.dirname(options.data.root.page.outputPath);
    let rootPath = path.join(process.cwd(), './build');
    let relativePath = path.relative(pagePath, rootPath);
    if (relativePath.length == 0) {
      relativePath += '.';
    }
    // change to forward slashes
    let finalPath = relativePath.replaceAll('\\', '/');
    return finalPath;
  });


  // ==================
  // 11ty Image Plugin
  // ==================
	function imageShortcode(src, alt, sizes, modifier) {
    // console.log(`Generating image(s) from:  ${src}`);
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
		eleventyImageTransformPlugin(src, options)

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
		metadata = eleventyImageTransformPlugin.statsSync(src, options)
		return eleventyImageTransformPlugin.generateHTML(metadata, imageAttributes)
	}

  // Handlebar useage
  // {{{image src alt sizes modifier}}}
  // @src        source file to process
  // @alt        image alt text | Optionaly set to 'hidden' to make it invisible to screen readers
  // @sizes      Optional | image tag sizes attribute | Defaults to '(min-width: 1024px) 100vw, 50vw'
  // @modifier   Optional | image class attibute
  // Example: {{{image "path/to/sorce/file.ext" "photo alt" "image size:optional" 'image class:optional'}}}
  eleventyConfig.addShortcode('image', imageShortcode)


  // ================
  // Post Processing
  // ================
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

 // ================
 // Layouts Aliases
 // ================
 eleventyConfig.addLayoutAlias('default', 'base.hbs');

  // ============
  // Base Config
  // ============
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
};
