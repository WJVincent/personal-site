const router = require("express").Router();
const { prepareHTML } = require("../utils");

router.get("/", async (_req, res) => {
  const home = await prepareHTML("basic", "home", { fileName: "home" });
  res.send(home);
});

router.get("/blog", async (_req, res) => {
  const blog = await prepareHTML("basic", "blog", { fileName: "blog" });
  res.send(blog);
});

router.get("/blog/:name", async (req, res) => {
  const { name } = req.params;
  const blog = await prepareHTML("basic", "blog_post", {
    dirName: "blog_posts",
    fileName: name,
    fileType: "md",
  });
  res.send(blog);
});

router.get("/projects", async (_req, res) => {
  const projects = await prepareHTML("basic", "projects", {
    fileName: "projects",
  });
  res.send(projects);
});

router.get("/contact", async (_req, res) => {
  const contact = await prepareHTML("basic", "contact", {
    fileName: "contact",
  });
  res.send(contact);
});

router.post("/search", async (req, res) => {
  const pattern = req.body["full-text"];

  const searchPage = await prepareHTML("basic", "search", {
    fileName: "search",
    pattern,
  });

  res.send(searchPage);
});

module.exports = router;
