const router = require("express").Router();
const withColorsRouter = require("./withColors");
const tarminalRouter = require("./terminal");

router.use("/basic", withColorsRouter);
router.use("/terminal", tarminalRouter);

module.exports = router;
