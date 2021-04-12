const playerService = require('../services/playerService');

async function getPlayers(req, res) {
    const { page = 0, pageSize = 50, position = 'All' } = req.query;

    try {
        const players = await playerService.getPlayers(page, parseInt(pageSize), position);

        return res.status(200).json(players);
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.getPlayers = getPlayers;
