const GoalieService = require('../services/goalieService');

async function getGoalies(req, res) {
    const { page = 0, pageSize = 50, sort = 'name.last' } = req.query;

    try {
        const players = await GoalieService.getGoalies(page, parseInt(pageSize), JSON.parse(sort));

        return res.status(200).json(players);
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.getGoalies = getGoalies;
