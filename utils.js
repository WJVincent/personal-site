const fs = require('fs');
const path = require('path');

const readFile = (dirName, fileName, type) => {
    return fs.readFileSync(path.join(__dirname, `/${dirName}/${fileName}.${type}`), 'utf-8');
}

const getBlogPostNames = async () => {
    return await fs.promises.readdir('blog_posts');
};

module.exports = { readFile, getBlogPostNames };