const fs = require("fs");
const path = require("path");
const showdown = require("showdown"); // markdown -> html convertor
const { minify } = require("html-minifier");
const convertor = new showdown.Converter();
const pTagNoStyle =
  "This is powered by a simple server that responds with static html. It doesn't have any client side JavaScript, it doesn't have any CSS, there is no unnecessary bloat.";
const pTagBasicStyle =
  "This is powered by a simple server that responds with static html. It doesn't have any client side JavaScript, <s>it doesn't have any CSS</s>, there is no unnecessary bloat.";

// code taken from SO, could be broken, test more
const convertBytes = (x) => {
  const units = [
    "bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
};

const readFile = (dirName, fileName, type) => {
  return fs.readFileSync(
    path.join(__dirname, `/${dirName}/${fileName}.${type}`),
    "utf-8",
  );
};

const getBlogPostNames = (prefix) => {
  const postNames = fs.readdirSync("blog_posts");

  const parseFileNames = postNames.map((fileName) => {
    const name = fileName.split(".")[0];
    const [date, title] = name.split("_");
    return {
      data:
        prefix === "basic"
          ? `<li><a href="/basic/blog/${date}_${title}">${title.split("-").join(" ")}</a> -- ${date}</li>`
          : `<li><a href="/blog/${date}_${title}">${title.split("-").join(" ")}</a> -- ${date}</li>`,
      date,
      fileName,
    };
  });

  const sortFilesByDateReverse = parseFileNames.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (b.date < a.date) return -1;
    return 0;
  });

  const html = sortFilesByDateReverse.map((obj) => [obj.data, obj.fileName]);

  return html;
};

const blogPostHTML = (indexHtml, templateStr, prefix) => {
  const content = convertor.makeHtml(templateStr);

  if (prefix === "basic") {
    return indexHtml.replace(
      /{%CONTENT%}/g,
      `<a href="/basic/blog">&lt;- blog-index</a><div>${content}</div>`,
    );
  }

  return indexHtml.replace(
    /{%CONTENT%}/g,
    `<a href="/blog">&lt;- blog-index</a><div>${content}</div>`,
  );
};

const normalPageHTML = (indexHtml, templateStr, prefix) => {
  let withContent = indexHtml.replace(/{%CONTENT%}/g, templateStr);

  if (prefix === "basic") {
    return withContent.replace(/{%PTAG%}/g, pTagBasicStyle);
  }

  return withContent.replace(/{%PTAG%}/g, pTagNoStyle);
};

const projectIndexHTML = (prefix, content) => {
  const projectFiles = fs.readdirSync("projects");

  const projectContent = projectFiles.map(fileName => {
    const fileContent = fs.readFileSync('projects/' + fileName, 'utf8');
    return fileContent;
  });

  return content.replace(/{%CONTENT%}/, projectContent.join(''));
}

const blogIndexHTML = (prefix, templateStr) => {
  const postData = getBlogPostNames(prefix);
  return templateStr.replace(
    /{%CONTENT%}/g,
    postData.map((post) => post[0]).join(""),
  );
};

const injectContent = (indexStr, templateStr, route, prefix) => {
  const content =
    route === "blog_post"
      ? blogPostHTML(indexStr, templateStr, prefix)
      : normalPageHTML(indexStr, templateStr, prefix);

  if (route === "blog") return blogIndexHTML(prefix, content);
  if (route === "projects") return projectIndexHTML(prefix, content);
  return content;
};

const injectStyle = (templateStr, prefix) => {
  if (prefix === "") {
    return templateStr.replace(/{%STYLE%}/g, "");
  } else if (prefix === "basic") {
    const basicStyle = readFile("html", "basic-style", "html");
    return templateStr.replace(/{%STYLE%}/g, basicStyle);
  } else {
    return templateStr;
  }
};

const prepareHTML = (prefix, route, readFileOpts) => {
  if (!readFileOpts.dirName) readFileOpts.dirName = "html";
  if (!readFileOpts.fileType) readFileOpts.fileType = "html";

  const { dirName, fileName, fileType } = readFileOpts;

  const index = readFile("html", "index", "html");
  const template = readFile(dirName, fileName, fileType);

  const withContent = injectContent(index, template, route, prefix);
  const withStyle = injectStyle(withContent, prefix);

  const res = withStyle.replace(
    /{%ROUTE_PREFIX%}/g,
    prefix ? "/" + prefix : prefix,
  );

  const minRes = minify(res, {
    collapseWhitespace: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
  });

  const size = new Blob([minRes]).size;
  const withPageSize = minRes.replace(/{%PAGE_SIZE%}/g, convertBytes(size));
  return withPageSize;
};

module.exports = {
  readFile,
  getBlogPostNames,
  convertBytes,
  prepareHTML,
};
