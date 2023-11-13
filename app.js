const express = require('express');
const path = require('path');
const { readFile, getBlogPostNames, getResume } = require('./utils.js');

const port = process.env.PORT || 5000;
const index = readFile('html', 'index', 'html');

const app = express();

app.use('/resume', express.static(path.join(__dirname, 'vincent_william_resume.pdf')));

app.get('/', async (req, res) => {
    const home = readFile('html', 'home', 'html');
    const templated =  index.replace(/{%CONTENT%}/g, home);

    res.send(templated)
});

app.get('/blog', async (req, res) => {
    const blog = readFile('html', 'blog', 'html');
    const postData = await getBlogPostNames();
    const templated =  index.replace(/{%CONTENT%}/g, blog);
    const templatedWithPostNames = templated.replace(/{%CONTENT%}/g, postData.join(''));

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