export default {
  layout: "post.njk",
  permalink: data => data.draft ? false : `/posts/${data.page.fileSlug}/`,
  eleventyComputed: {
    activeCategory: data => data.category,
    currentCategory: data => data.site.categories.find(category => category.slug === data.category)
  }
};
