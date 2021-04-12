const express = require('express');
const GoalieController = require('../controllers/goalieController');

const router = express.Router();

router.get('/', GoalieController.getGoalies);

module.exports = router;
