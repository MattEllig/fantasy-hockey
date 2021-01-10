const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalieSchema = new Schema({
    _id: Number,
    name: {
        first: String,
        last: String
    },
    currentTeam: {
        nhlId: Number,
        name: String,
        abbreviation: String
    },
    stats: {
        games: Number,
        gamesStarted: Number,
        wins: Number,
        losses: Number,
        otLosses: Number,
        shutouts: Number,
        saves: Number,
        savePercentage: Number,
        goalsAgainst: Number,
        goalsAgainstAverage: Number
    }
});

const Goalie = mongoose.model('Goalie', goalieSchema);

module.exports = Goalie;
