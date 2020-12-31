const winston = require('winston');
const Goalie = require('../models/goalie');
const GoalieStats = require('../models/goalieStats');
const nhlStatsApi = require('./nhlStatsApi');
const statsConfig = require('./statsConfig.json');

/**
 * Creates a new Goalie, retrieving their information from the NHL Stats API by their NHL player ID.
 * @param {number} playerId A valid NHL player ID.
 * @returns {Promise<Document<any>>} The Goalie document created.
 */
async function create(playerId) {
    if (!playerId) {
        throw new Error('NHL id is required to create a Goalie');
    }

    try {
        const playerDetails = await fetchPlayerDetails(playerId);
        const playerStats = await fetchPlayerStatsForLastTwoSeasons(playerId);

        if (playerStats.length === 0) {
            throw new Error(`Player with ID ${playerId} has not played any games`);
        }

        const goalieStats = await GoalieStats.insertMany(playerStats);

        const playerDetailsWithStats = {
            ...playerDetails,
            stats: goalieStats.map(stats => stats._id)
        };

        return await Goalie.create(playerDetailsWithStats);
    } catch (error) {
        winston.error(error.message);
        throw new Error(`Unable to create a Goalie for id ${playerId}`);
    }
}

/**
 * Creates a new Goalie for each one in the given list of NHL player IDs, retrieving their information from the NHL Stats API.
 * @param {number[]} playerIds A set of valid NHL player IDs.
 * @param {number} [minGamesPlayed] If provided, no players in the ID set will be created who have not played at least as many games a specified between the current and previous
 * seasons combined.
 * @returns {Promise<Document<any>>} The Goalie documents created.
 */
async function createMany(playerIds, minGamesPlayed = 0) {
    if (!playerIds || playerIds.length === 0) {
        throw new Error('NHL ids are required to create Goalies');
    }

    try {
        const goalies = [];

        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];

            const playerDetails = await fetchPlayerDetails(playerId);
            const playerStats = await fetchPlayerStatsForLastTwoSeasons(playerId);

            if (playerStats.length === 0 || (minGamesPlayed && playerStats.reduce((previousValue, currentValue) => previousValue + currentValue.games, 0) < minGamesPlayed)) {
                continue;
            }

            const goalieStats = await GoalieStats.insertMany(playerStats);

            const playerDetailsWithStats = {
                ...playerDetails,
                stats: goalieStats.map(stats => stats._id)
            };

            goalies.push(playerDetailsWithStats);
        }

        return await Goalie.insertMany(goalies);
    } catch (error) {
        winston.error(error.message);
        throw new Error('Error creating Goalies');
    }
}

async function fetchPlayerDetails(playerId) {
    if (!playerId) {
        throw new Error('NHL id is required to fetch player details');
    }

    const playerDetails = await nhlStatsApi.fetchPlayerDetails(playerId);

    if (!playerDetails) {
        throw new Error(`Player with ID ${playerId} not found`);
    }

    if (playerDetails.primaryPosition.code !== 'G') {
        throw new Error(`Player with ID ${playerId} is not a Goalie`);
    }

    return {
        _id: playerDetails.id,
        name: {
            first: playerDetails.firstName,
            last: playerDetails.lastName
        },
        currentTeam: playerDetails.currentTeam ? {
            teamId: playerDetails.currentTeam.id,
            name: playerDetails.currentTeam.name
        } : null
    };
}

async function fetchPlayerStatsForLastTwoSeasons(playerId) {
    if (!playerId) {
        throw new Error('NHL id is required to fetch player stats');
    }

    const playerStats = [];

    const currentPlayerStats = await nhlStatsApi.fetchPlayerStatsForSeason(playerId, statsConfig.currentSeason);
    if (currentPlayerStats) {
        playerStats.push(formatPlayerStats(currentPlayerStats, playerId));
    }

    const previousPlayerStats = await nhlStatsApi.fetchPlayerStatsForSeason(playerId, statsConfig.previousSeason);
    if (previousPlayerStats) {
        playerStats.push(formatPlayerStats(previousPlayerStats, playerId));
    }

    return playerStats;
}

function formatPlayerStats(playerStats, playerId) {
    if (!playerStats || !playerId) {
        throw new Error('Player stats and associated ID are required for complete data formatting');
    }

    return {
        goalie: playerId,
        season: playerStats.season,
        games: playerStats.games,
        gamesStarted: playerStats.gamesStarted,
        wins: playerStats.wins,
        losses: playerStats.losses,
        otLosses: playerStats.ot,
        shutouts: playerStats.shutouts,
        saves: playerStats.saves,
        savePercentage: playerStats.savePercentage,
        goalsAgainst: playerStats.goalsAgainst,
        goalsAgainstAverage: playerStats.goalsAgainstAverage
    };
}

exports.create = create;
exports.createMany = createMany;
