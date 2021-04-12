const SkaterService = require('../services/skaterService');

async function getSkaters(req, res) {
    const {
        page = 0,
        pageSize = 50,
        position = 'All',
        sort = 'name.last',
    } = req.query;

    try {
        const players = await SkaterService.getSkaters(page, parseInt(pageSize), position, JSON.parse(sort));

        return res.status(200).json(players);
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.getSkaters = getSkaters;
