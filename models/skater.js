const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skaterSchema = new Schema({
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
    positions: [String],
    stats: {
        games: Number,
        goals: Number,
        assists: Number,
        points: Number,
        shots: Number,
        blocks: Number,
        hits: Number,
        powerPlayGoals: Number,
        powerPlayPoints: Number,
        shortHandedGoals: Number,
        shortHandedPoints: Number,
        timeOnIcePerGame: String,
        plusMinus: Number,
        penaltyMinutes: Number,
        gameWinningGoals: Number,
        faceOffPct: Number
    }
});

const Skater = mongoose.model('Skater', skaterSchema);

module.exports = Skater;
