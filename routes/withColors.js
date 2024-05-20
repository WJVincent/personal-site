const router = require('express').Router();
const {prepareHTML } = require('../utils');

router.get('/', async (_req, res) => {
    const home = prepareHTML('basic', 'home', {fileName: 'home'});
    res.send(home);
});

router.get('/blog', (_req, res) => {
    const blog = prepareHTML('basic', 'blog', {fileName: 'blog'});
    res.send(blog);
});

router.get('/blog/:name', (req, res) => {
    const {name} = req.params;
    const blog = prepareHTML('basic', 'blog_post', {dirName: 'blog_posts', fileName: name, fileType: 'md'});
    res.send(blog);
});

router.get('/projects', async (_req, res) => {
    const projects = prepareHTML('basic', 'projects', {fileName: 'projects'});
    res.send(projects)
});

router.get('/contact', async (_req, res) => {
    const contact = prepareHTML('basic', 'contact', {fileName: 'contact'});
    res.send(contact);
});

module.exports = router;
