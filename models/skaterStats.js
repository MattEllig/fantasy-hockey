const mongoose = require('mongoose');

const skaterStatsSchema = new mongoose.Schema({
    skater: {
        type: Number,
        ref: 'Skater'
    },
    season: String,
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
    timeOnIce: String,
    plusMinus: Number,
    penaltyMinutes: Number,
    gameWinningGoals: Number,
    faceOffPct: Number
});

const SkaterStats = mongoose.model('Skater_Stats', skaterStatsSchema);

module.exports = SkaterStats;
