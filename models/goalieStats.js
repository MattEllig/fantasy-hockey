const mongoose = require('mongoose');

const goalieStatsSchema = new mongoose.Schema({
    goalie: {
        type: Number,
        ref: 'Goalie'
    },
    season: String,
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
});

const GoalieStats = mongoose.model('Goalie_Stats', goalieStatsSchema);

module.exports = GoalieStats;
