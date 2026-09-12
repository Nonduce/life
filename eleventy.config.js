export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });
  eleventyConfig.addFilter("dateLabel", value => new Intl.DateTimeFormat("zh-CN", {
    year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC"
  }).format(new Date(value)).replaceAll("/", "."));
  eleventyConfig.addFilter("dateISO", value => new Date(value).toISOString().slice(0, 10));
  eleventyConfig.addFilter("categoryPosts", (posts, category) => posts.filter(post => post.data.category === category));
  eleventyConfig.addCollection("posts", collection => {
    const posts = collection.getFilteredByGlob("src/posts/**/*.md").filter(post => !post.data.draft);
    for (const post of posts) {
      for (const field of ["title", "description", "cover", "coverAlt"]) {
        if (typeof post.data[field] !== "string" || !post.data[field].trim()) {
          throw new Error(`${post.inputPath}: missing required article field '${field}'.`);
        }
      }
      if (!["f1", "food", "photography"].includes(post.data.category)) {
        throw new Error(`${post.inputPath}: category must be f1, food or photography.`);
      }
      if (!post.data.date || !Number.isFinite(new Date(post.data.date).getTime())) {
        throw new Error(`${post.inputPath}: date must be a valid YYYY-MM-DD date.`);
      }
    }
    return posts.sort((a, b) => b.date - a.date);
  });
  return {
    dir: { input: "src", output: "dist", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: process.env.SITE_PATH_PREFIX || "/life/"
  };
}
