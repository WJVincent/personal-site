const fs = require("fs");
const path = require("path");
const showdown = require('showdown'); // markdown -> html convertor
const convertor = new showdown.Converter();

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

const getBlogPostNames = () => {
  const postNames = fs.readdirSync("blog_posts");

  const parseFileNames = postNames.map((fileName) => {
    const name = fileName.split(".")[0];
    const [date, title] = name.split("_");
    return {
      data: `<li><a href="/blog/${date}_${title}">${title}</a> -- ${date}</li>`,
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

const prepareHTML = (prefix, route, readFileOpts) => {
  if(!readFileOpts.dirName) readFileOpts.dirName = 'html';
  if(!readFileOpts.fileType) readFileOpts.fileType = 'html';

  const { dirName, fileName, fileType } = readFileOpts;
  const index = readFile("html", "index", "html");
  let template = readFile(dirName, fileName, fileType);
  let withContent;

  if(route === 'blog_post'){
    const content = convertor.makeHtml(template);
    withContent = index.replace(/{%CONTENT%}/g, `<a href="/blog"><- blog-index</a><div>${content}</div>`);

  } else {
    withContent = index.replace(/{%CONTENT%}/g, template);
  }
 
  let optEdit;
  if(route === 'blog'){
    const postData = getBlogPostNames();
    optEdit = withContent.replace(/{%CONTENT%}/g, postData.map(post=> post[0]).join(''))
  }
  
    
  if(optEdit) withContent = optEdit;
  
  let withStyle; 

  if(prefix === ''){
    withStyle = withContent.replace(/{%STYLE%}/g, '');
  } else {
      //TODO: actually add style injection
      withStyle = withContent;
  }

  const size = new Blob([withStyle]).size;
  const withPageSize = withStyle.replace(/{%PAGE_SIZE%}/g, convertBytes(size));
  const res = withPageSize.replace(/{%ROUTE_PREFIX%}/g, prefix);
  return res;
};

module.exports = {
  readFile,
  getBlogPostNames,
  convertBytes,
  prepareHTML,
};
