const router = require('express').Router();
const withColorsRouter = require('./withColors');

router.use('/lv1', withColorsRouter);

module.exports = router;
