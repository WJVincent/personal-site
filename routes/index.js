const router = require("express").Router();
const withColorsRouter = require("./withColors");

router.use("/basic", withColorsRouter);

module.exports = router;
