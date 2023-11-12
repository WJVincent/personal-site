const fs = require('fs');
const path = require('path');

const readFile = (fileName) => {
    return fs.readFileSync(path.join(__dirname, `/html/${fileName}.html`), 'utf-8');
}

const getBlogPostNames = async () => {
    return await fs.promises.readdir('blog_posts');
};

module.exports = { readFile, getBlogPostNames };