const express = require('express');
const { shorten } = require('../controllers/shorten.controller');

const router = express.Router();

router.post('/', shorten);

module.exports = router;
