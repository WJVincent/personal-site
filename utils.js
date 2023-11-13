const fs = require('fs');
const path = require('path');

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
            }
    });

    const sortFilesByDateReverse = parseFileNames.sort((a,b) => {
        if(a.date < b.date) return 1
        if(b.date < a.date) return -1;
        return 0;
    });

    const htmlStringsOnly = sortFilesByDateReverse.map(obj => obj.data);
    
    return htmlStringsOnly;
};

module.exports = { readFile, getBlogPostNames};