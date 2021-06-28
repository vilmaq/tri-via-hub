const { Router } = require("express");

const authenticate = require("../../middleware/authenticate");

const publicViews = require("./publicViews");
const privateViews = require("./privateViews");

const router = Router();

router.use(authenticate, privateViews);
router.use(publicViews);

module.exports = router;
