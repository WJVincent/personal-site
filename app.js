const express = require('express');
const xmlescape = require('xml-escape');
const showdown = require('showdown'); // markdown -> html convertor
const path = require('path');

const { readFile, getBlogPostNames, convertBytes, readRssFeed } = require('./utils.js');

const port = process.env.PORT || 5000;
const index = readFile('html', 'index', 'html');

const app = express();
const convertor = new showdown.Converter();

app.use('/resume', express.static(path.join(__dirname, 'vincent_william_resume.pdf')));

app.get('/', async (_req, res) => {
    const home = readFile('html', 'home', 'html');
    const templated =  index.replace(/{%CONTENT%}/g, home);
    const size = new Blob([templated]).size;
    const finalRes = templated.replace(/{%PAGE_SIZE%}/g, convertBytes(size));

    res.send(finalRes);
});

app.get('/blog', async (_req, res) => {
    const blog = readFile('html', 'blog', 'html');
    const postData = await getBlogPostNames();
    const templated =  index.replace(/{%CONTENT%}/g, blog);
    const templatedWithPostNames = templated.replace(/{%CONTENT%}/g, postData.map(post => post[0]).join(''));
    const size = new Blob([templatedWithPostNames]).size;
    const finalRes = templatedWithPostNames.replace(/{%PAGE_SIZE%}/g, convertBytes(size));

    res.send(finalRes);
});

app.get('/blog/:name', (req, res) => {
    const {name} = req.params;
    const blog = readFile('blog_posts', name, 'md');
    const content = convertor.makeHtml(blog);
    const templated = index.replace(/{%CONTENT%}/g, `<a href="/blog"><- blog-index</a><div>${content}</div>`);
    const size = new Blob([templated]).size;
    const finalRes = templated.replace(/{%PAGE_SIZE%}/g, convertBytes(size));

    res.send(finalRes);
});

app.get('/projects', async (_req, res) => {
    const projects = readFile('html', 'projects', 'html');
    const templated =  index.replace(/{%CONTENT%}/g, projects);
    const size = new Blob([templated]).size;
    const finalRes = templated.replace(/{%PAGE_SIZE%}/g, convertBytes(size));

    res.send(finalRes);
});

app.get('/contact', async (_req, res) => {
    const contact = readFile('html', 'contact', 'html');
    const templated =  index.replace(/{%CONTENT%}/g, contact);
    const size = new Blob([templated]).size;
    const finalRes = templated.replace(/{%PAGE_SIZE%}/g, convertBytes(size));

    res.send(finalRes);
});

app.get('/feed.rss', async (_req, res) => {
    let rss = readRssFeed();
    const blogData = await getBlogPostNames();
    const blogNames = blogData.map(post => post[1]); 

    blogNames.forEach(fileName => {
        const [name, _fileExt] = fileName.split('.')
        const data = readFile('blog_posts', name, 'md');
        const term = `{%${name}%}`;
        const re = new RegExp(term);
        rss = rss.replace(re, xmlescape(convertor.makeHtml(data)));
    }); 

    res.set('Content-Type', 'text/xml');
    res.send(rss);
});

app.listen(port, () => console.log(`listening at port ${port}`));

