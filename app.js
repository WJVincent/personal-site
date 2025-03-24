const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const routes = require('./routes');
const { prepareHTML } = require('./utils.js');

const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
app.use('/resume', express.static(path.join(__dirname, 'vincent_william_resume.pdf')));

app.get('/', async (_req, res) => {
  const home = await prepareHTML('', 'home', { fileName: 'home' });
  res.send(home);
});

app.get('/42', (_req, res) => {
  res.send(`<h1>What is the meaning of life, the universe and everything?  *42*
    Douglas Adams, the only person who knew what this question really was about is
    now dead, unfortunately.  So now you might wonder what the meaning of death
    is...</h1>`);
});

app.get('/blog', async (_req, res) => {
  const blog = await prepareHTML('', 'blog', { fileName: 'blog' });
  res.send(blog);
});

app.get('/blog/:name', async (req, res) => {
  const { name } = req.params;
  const blog = await prepareHTML('', 'blog_post', { dirName: 'blog_posts', fileName: name, fileType: 'md' });
  res.send(blog);
});

app.get('/projects', async (_req, res) => {
  const projects = await prepareHTML('', 'projects', { fileName: 'projects' });
  res.send(projects)
});

app.get('/contact', async (_req, res) => {
  const contact = await prepareHTML('', 'contact', { fileName: 'contact' });
  res.send(contact);
});

app.post('/search', async (req, res) => {
  const pattern = req.body["full-text"];

  const searchPage = await prepareHTML('', 'search', { fileName: 'search', pattern })

  res.send(searchPage);
})

app.use((_req, res, _next) => {
  res.status(404).send('<h1><a href="https://datatracker.ietf.org/doc/html/rfc2549">rtfm</a></h1>');
})

app.listen(port, () => console.log(`listening at port ${port}`));
