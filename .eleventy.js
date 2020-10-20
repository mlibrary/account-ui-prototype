const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginSass = require("eleventy-plugin-sass");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const stencil = require("@umich-lib/components/hydrate");

module.exports = function (eleventyConfig) {
  // Copy `css/` to `_site/css/`.
  eleventyConfig.addPassthroughCopy("css");
  // Copy everything in static to _site
  eleventyConfig.addPassthroughCopy("static");

  // Enable plugins.
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginSass);

  // Tell the MD processor to add IDs and links to headings.
  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      linkify: true,
      typographer: true,
    }).use(markdownItAnchor)
  );

  // Server side rendering for @umich-lib/components.
  eleventyConfig.addTransform("ssr", async (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      try {
        const { html } = await stencil.renderToString(content);
        return html;
      } catch (error) {
        return error;
      }
    }
    return content;
  });
};
