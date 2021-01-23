const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/google', authController.google);
router.get('/google/callback', authController.googleCallback);

module.exports = router;
