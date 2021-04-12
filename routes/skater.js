const express = require('express');
const SkaterController = require('../controllers/skaterController');

const router = express.Router();

router.get('/', SkaterController.getSkaters);

module.exports = router;
