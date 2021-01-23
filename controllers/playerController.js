const playerSerivce = require('../services/playerService');

async function getPlayers(req, res) {
    try {
        const players = await playerSerivce.getPlayers();

        return res.status(200).json(players);
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.getPlayers = getPlayers;
