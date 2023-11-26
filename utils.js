const fs = require('fs');
const path = require('path');

   
const convertBytes = (x) => {
  const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  let l = 0, n = parseInt(x, 10) || 0;

  while(n >= 1024 && ++l){
      n = n/1024;
  }
  
  return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

const readFile = (dirName, fileName, type) => {
    return fs.readFileSync(path.join(__dirname, `/${dirName}/${fileName}.${type}`), 'utf-8');
}

const getBlogPostNames = async () => {
    const postNames = await fs.promises.readdir('blog_posts');

    const parseFileNames = postNames.map(fileName => {
        const name = fileName.split('.')[0];
        const [date, title] = name.split(':');
        return {
            data: `<li><a href="/blog/${date}:${title}">${title}</a> -- ${date}</li>`,
            date
        };
    });

    const sortFilesByDateReverse = parseFileNames.sort((a, b) => {
        if (a.date < b.date) return 1;
        if (b.date < a.date) return -1;
        return 0;
    });

    const htmlStringsOnly = sortFilesByDateReverse.map(obj => obj.data);

    return htmlStringsOnly;
};

module.exports = { readFile, getBlogPostNames, convertBytes };

