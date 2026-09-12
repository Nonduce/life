# Nonduce · life

分享 F1 观赛、日常探店与摄影记录的个人网站。设计采用白底、近黑文字与少量赛车红，照片优先，文字简洁。

网站使用 **Eleventy + Markdown + 原生 CSS**，输出纯静态 HTML。读者浏览页面不需要下载前端框架，写文章也不用修改页面组件。

预期线上地址：**https://nonduce.github.io/life/**。

## 仓库结构

```text
life/
├── .github/workflows/pages.yml      # GitHub Pages 自动构建和发布
├── eleventy.config.js              # 构建、分类、日期与 /life/ 路径配置
├── package.json
├── package-lock.json               # 固定构建依赖
├── src/
│   ├── _data/site.json              # 站名、作者、栏目和简介
│   ├── _includes/
│   │   ├── base.njk                # 共享导航、页脚和网页元信息
│   │   ├── card.njk                # 首页和分类页的文章卡片
│   │   └── post.njk                # 文章排版
│   ├── posts/
│   │   ├── posts.11tydata.js        # 文章的共享配置
│   │   ├── f1/                     # F1 观赛文章，Markdown
│   │   ├── food/                   # 探店文章，Markdown
│   │   └── photography/            # 摄影文章，Markdown
│   ├── assets/
│   │   ├── css/style.css           # 颜色、字体和响应式布局
│   │   ├── images/                 # 你自己的照片，按文章分文件夹
│   │   └── favicon.svg             # 网站图标
│   ├── index.njk                   # 首页：最近记录和栏目索引
│   ├── categories.njk              # 自动生成三个分类页
│   ├── about.njk                   # 关于
│   └── .nojekyll
├── templates/post.md               # 新文章模板，不参与网站构建
├── scripts/
│   ├── clean.mjs                   # 清理旧产物，避免已删除文章残留
│   └── check-site.mjs              # 校验构建后的路径和资源
├── docs/design.md                  # 设计说明与内容建议
├── docs/images.md                  # 示例图片来源与许可
└── dist/                           # 构建产物，自动生成，不提交
```

## 本地预览

使用 Node.js 22 或更新版本（发布工作流使用 24）：

```bash
npm ci
npm run dev
```

打开终端显示的地址，默认 **http://localhost:4321/life/**。预览会随着文章和样式的修改自动更新。预览产物在 `.cache/preview/`，不会和生产构建混在一起。

构建并检查正式网站：

```bash
npm run build
npm run check
```

## 发布到 GitHub Pages

1. 将本仓库文件上传到 **Nonduce/life** 的 **main** 分支，保留 `.github` 文件夹和 `package-lock.json`。不要上传 `node_modules`、`.cache` 和 `dist`。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 中选 **GitHub Actions**。本项目要将 Markdown 构建成网页，因此使用 Actions 发布，而不是直接发布源分支。
3. 保持 **Custom domain** 留空。
4. 提交代码后，打开 **Actions**，等待 **Deploy life to GitHub Pages** 成功，再访问 **https://nonduce.github.io/life/**。

修改文章或照片后，提交到 `main` 就会重新发布。Pull request 只构建和检查，不发布。

如果个人主页已经绑定了自定义域名，GitHub 的项目网站可能默认继承该域名；以 Pages 设置显示的实际地址为准。

官方参考：[GitHub Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[Eleventy](https://www.11ty.dev/)。

## 新增一篇记录

1. 复制 `templates/post.md` 到相应的 `src/posts/` 子目录，例如 `src/posts/f1/shanghai-race-weekend.md`。
2. 修改顶部的信息，`category` 使用 `f1`、`food` 或 `photography`。文件名用小写英文和短横线，并在所有栏目中保持唯一。
3. 将照片放到 `src/assets/images/shanghai-race-weekend/`。推荐 WebP/JPEG，封面宽约 1600 像素，每张尽量控制在 500 KB 左右。
4. 写好内容，把 `draft: true` 改为 `draft: false`，预览确认后提交。

文章默认地址是 `/life/posts/文件名/`，调整源文件的栏目文件夹不会改变文章地址。首页按日期从新到旧排列，最新一篇使用大图排版。

`draft: true` 的文章不会生成网页，也不会显示在列表中，但源码仍会存在于公开仓库。请勿把个人隐私写进草稿。

封面和正文图片示例：

```yaml
cover: /assets/images/shanghai-race-weekend/cover.webp
coverAlt: 发车前的赛道与看台
```

```markdown
![夕阳下的赛道]({{ '/assets/images/shanghai-race-weekend/photo-01.webp' | url }})
```

本地封面由模板自动补上 `/life/`；正文图片用 `url` 过滤器补路径。不要在源文件里重复写 `/life/life/`。

可选署名字段：`photographer` 和 `photoSource`。使用自己的照片时可省略，图片说明仍显示 `coverAlt`。

## 更换示例内容

现有三篇文章和 Unsplash 照片用于展示设计，不代表 Nonduce 的真实经历或摄影作品。发布个人网站之前，可将其删除或改写，并设为 `sample: false`。示例标签会自动隐藏。

## 修改外观

- 颜色和字体：`src/assets/css/style.css` 开头的 CSS 变量。
- 站名和栏目简介：`src/_data/site.json`。
- 关于文字：`src/about.njk`。
- 页面公共结构：`src/_includes/base.njk`。

正文默认采用本地系统字体并尝试加载 Noto Sans SC；即使字体服务不可用，页面仍可用系统中文字体正常显示。
