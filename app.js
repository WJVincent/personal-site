const express = require('express');
const { readFile, getBlogPostNames } = require('./utils.js');

const port = process.env.PORT || 5000;
const index = readFile('html', 'index', 'html');

const app = express();

app.get('/', async (req, res) => {
    const home = readFile('html', 'home', 'html');
    const templated =  index.replace(/{%CONTENT%}/g, home);

    res.send(templated)
});

app.get('/blog', async (req, res) => {
    const blog = readFile('html', 'blog', 'html');
    const postNames = await getBlogPostNames();

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
    const templated =  index.replace(/{%CONTENT%}/g, blog);
    const templatedWithPostNames = templated.replace(/{%CONTENT%}/g, htmlStringsOnly.join(''));

    res.send(templatedWithPostNames);
});

app.get('/blog/:name', (req, res) => {
    const {name} = req.params;
    const blog = readFile('blog_posts', name, 'txt');
    const templated = index.replace(/{%CONTENT%}/g, `<a href="/blog"><- blog-index</a><p>${blog}</p>`);
    res.send(templated);
});

app.get('/projects', async (req, res) => {
    const projects = readFile('html', 'projects', 'html');
    const templated =  index.replace(/{%CONTENT%}/g, projects);

    res.send(templated)
});

app.get('/contact', async (req, res) => {
    const contact = readFile('html', 'contact', 'html');
    const templated =  index.replace(/{%CONTENT%}/g, contact);

    res.send(templated)
});

app.listen(port, () => console.log(`listening at port ${port}`));