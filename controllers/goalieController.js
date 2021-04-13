const GoalieService = require('../services/goalieService');

async function getGoalies(req, res) {
    const {
        page = 0,
        pageSize = 50,
        search,
        sort = 'name.last',
        team,
    } = req.query;

    try {
        const players = await GoalieService.getGoalies(
            page,
            parseInt(pageSize),
            search,
            JSON.parse(sort),
            team
        );

        return res.status(200).json(players);
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.getGoalies = getGoalies;
