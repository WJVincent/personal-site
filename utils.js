const fs = require("fs");
const path = require("path");
const showdown = require("showdown"); // markdown -> html convertor
const { minify } = require("html-minifier");
const { ripGrep: rg } = require('./ripgrep.js');
const convertor = new showdown.Converter();

const pTagNoStyle =
  "This is powered by a simple server that responds with static html. It doesn't have any client side JavaScript, it doesn't have any CSS, there is no unnecessary bloat.";
const pTagBasicStyle =
  "This is powered by a simple server that responds with static html. It doesn't have any client side JavaScript, <s>it doesn't have any CSS</s>, there is no unnecessary bloat.";

const parseRgOutput = (outputArr) => {
  const paths = outputArr.reduce((out, el) => {
    // remove dir and date prefix and .md suffix
    const pathArr = el.path.text.split('/');
    const path = pathArr[pathArr.length - 1].slice(0, -3);
    const lineText = el.lines.text;
    const lineNumber = el.line_number;
    const lineInfo = { lineNumber, lineText };

    if (out[path] === undefined) {
      out[path] = [lineInfo];
    } else {
      out[path].push(lineInfo);
    }

    return out;
  }, {})

  return paths;
};

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

const formatSearchResults = (prefix, data) => {
  let ulOut = "<ul>";
  for (let fileName in data) {
    const name = fileName.split(".")[0];
    const [date, title] = name.split("_");
    let li = '<li>'
    const postName = prefix === "basic"
      ? `<p><a href="/basic/blog/${date}_${title}">${title.split("-").join(" ")}</a> -- ${date}</p>`
      : `<p><a href="/blog/${date}_${title}">${title.split("-").join(" ")}</a> -- ${date}</p>`;
    li += postName;
    li += '<ul>';
    const lines = data[fileName].reduce((arr, el) => {
      let innerLi = '<li>'

      innerLi += `${el.lineNumber} : "${el.lineText}"`

      innerLi += '</li>'

      arr.push(innerLi);

      return arr;
    }, [])

    li += lines.join(' ');
    li += '</ul>';
    li += '</li>';

    ulOut += li;
  };
  return ulOut;
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

const searchIndexHTML = (prefix, content, templateStr, indexStr, pattern) => {
  const searchHTML = templateStr.replace(/{%CONTENT%}/, content);
  let withContent = indexStr.replace(/{%CONTENT%}/g, searchHTML);
  let withSearchTerm = withContent.replace(/{%SEARCH_TERM%}/, `"${pattern}"`);
  return withSearchTerm;
};

const injectContent = (indexStr, templateStr, route, prefix, data, pattern) => {
  let content;
  if (route === "blog_post") {
    content = blogPostHTML(indexStr, templateStr, prefix)
  } else if (route === "search") {
    content = formatSearchResults(prefix, parseRgOutput(data));
  } else {
    content = normalPageHTML(indexStr, templateStr, prefix);
  }

  if (route === "blog") return blogIndexHTML(prefix, content);
  if (route === "projects") return projectIndexHTML(prefix, content);
  if (route === "search") return searchIndexHTML(prefix, content, templateStr, indexStr, pattern);
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

const prepareHTML = async (prefix, route, readFileOpts) => {
  if (!readFileOpts.dirName) readFileOpts.dirName = "html";
  if (!readFileOpts.fileType) readFileOpts.fileType = "html";

  const { dirName, fileName, fileType, pattern } = readFileOpts;

  let data;
  if (pattern){
    data = await rg(path.join(__dirname, "blog_posts"), pattern);
  }

  const index = readFile("html", "index", "html");
  const template = readFile(dirName, fileName, fileType);

  const withContent = injectContent(index, template, route, prefix, data, pattern);
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
  parseRgOutput,
  formatSearchResults
};
