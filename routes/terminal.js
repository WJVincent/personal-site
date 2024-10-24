const router = require("express").Router();
const { prepareHTML } = require("../utils");

router.get("/", async (_req, res) => {
  const home = prepareHTML("terminal", "terminal", { fileName: "terminal" });
  res.send(home);
});

module.exports = router;
