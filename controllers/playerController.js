const playerSerivce = require('../services/playerService');

async function getPlayers(req, res) {
    const { page = 0, pageSize = 50 } = req.query;

    try {
        const players = await playerSerivce.getPlayers(page, parseInt(pageSize));

        return res.status(200).json(players);
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.getPlayers = getPlayers;
