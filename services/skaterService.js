const winston = require('winston');
const Skater = require('../models/skater');
const SkaterStats = require('../models/skaterStats');
const nhlStatsApi = require('./nhlStatsApi');
const statsConfig = require('./statsConfig.json');

/**
 * Creates a new Skater, retrieving their information from the NHL Stats API by their NHL player ID.
 * @param {number} playerId A valid NHL player ID.
 * @returns {Promise<Document<any>>} The Skater document created.
 */
async function create(playerId) {
    if (!playerId) {
        throw new Error('NHL id is required to create a Skater');
    }

    try {
        const playerDetails = await fetchPlayerDetails(playerId);
        const playerStats = await fetchPlayerStatsForLastTwoSeasons(playerId);

        if (playerStats.length === 0) {
            throw new Error(`Player with ID ${playerId} has not played any games`);
        }

        const skaterStats = await SkaterStats.insertMany(playerStats);

        const playerDetailsWithStats = {
            ...playerDetails,
            stats: skaterStats.map(stats => stats._id)
        };

        return await Skater.create(playerDetailsWithStats);
    } catch (error) {
        winston.error(error.message);
        throw new Error(`Unable to create a Skater for id ${playerId}`);
    }
}

/**
 * Creates a new Skater for each one in the given list of NHL player IDs, retrieving their information from the NHL Stats API.
 * @param {number[]} playerIds A set of valid NHL player IDs.
 * @param {number} [minGamesPlayed] If provided, no players in the ID set will be created who have not played at least as many games a specified between the current and previous
 * seasons combined.
 * @returns {Promise<Document<any>>} The Skater documents created.
 */
async function createMany(playerIds, minGamesPlayed = 0) {
    if (!playerIds || playerIds.length === 0) {
        throw new Error('NHL ids are required to create Skaters');
    }

    try {
        const skaters = [];

        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];

            const playerDetails = await fetchPlayerDetails(playerId);
            const playerStats = await fetchPlayerStatsForLastTwoSeasons(playerId);

            if (playerStats.length === 0 || (minGamesPlayed && playerStats.reduce((previousValue, currentValue) => previousValue + currentValue.games, 0) < minGamesPlayed)) {
                continue;
            }

            const skaterStats = await SkaterStats.insertMany(playerStats);

            const playerDetailsWithStats = {
                ...playerDetails,
                stats: skaterStats.map(stats => stats._id)
            };

            skaters.push(playerDetailsWithStats);
        }

        return await Skater.insertMany(skaters);
    } catch (error) {
        winston.error(error.message);
        throw new Error('Error creating Skaters');
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

    if (playerDetails.primaryPosition.code === 'G') {
        throw new Error(`Player with ID ${playerId} is not a Skater`);
    }

    return {
        _id: playerDetails.id,
        name: {
            first: playerDetails.firstName,
            last: playerDetails.lastName
        },
        currentTeam: playerDetails.currentTeam ? {
            nhlId: playerDetails.currentTeam.id,
            name: playerDetails.currentTeam.name
        } : null,
        positions: [playerDetails.primaryPosition.abbreviation]
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
        skater: playerId,
        season: playerStats.season,
        games: playerStats.games,
        goals: playerStats.goals,
        assists: playerStats.assists,
        points: playerStats.points,
        shots: playerStats.shots,
        blocks: playerStats.blocked,
        hits: playerStats.hits,
        powerPlayGoals: playerStats.powerPlayGoals,
        powerPlayPoints: playerStats.powerPlayPoints,
        shortHandedGoals: playerStats.shortHandedGoals,
        shortHandedPoints: playerStats.shortHandedPoints,
        timeOnIce: playerStats.timeOnIce,
        plusMinus: playerStats.plusMinus,
        penaltyMinutes: playerStats.pim,
        gameWinningGoals: playerStats.gameWinningGoals,
        faceOffPct: playerStats.faceOffPct
    };
}

exports.create = create;
exports.createMany = createMany;
