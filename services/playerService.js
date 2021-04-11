const winston = require('winston');
const Goalie = require('../models/goalie');
const Skater = require('../models/skater');
const nhlStatsApi = require('./nhlStatsApi');

const minGamesPlayed = require('../config.json').minGamesPlayed;

const TWELVE_HOURS = 1000 * 60 * 60 * 12;

/**
 * Given a player and information on their current team, creates their profile and stats in the database.
 * @param {nhlStatsApi.NhlRosterPlayer} rosterPlayer The player to update.
 * @param {object} teamInfo Information on the player's current team.
 * @param {number} teamInfo.nhlId The NHL ID of the player's current team.
 * @param {string} teamInfo.name The name of the player's current team.
 * @param {string} teamInfo.abbreviation The abbreviated name of the player's current team.
 * @returns {boolean} True if the player was created, false if they were skipped (i.e. not enough games played).
 */
async function createPlayer(rosterPlayer, teamInfo) {
    try {
        if (rosterPlayer.position.code !== 'G') {
            return await createSkater(rosterPlayer, teamInfo);
        } else {
            return await createGoalie(rosterPlayer, teamInfo);
        }
    } catch (error) {
        winston.error(error.message);
        throw new Error(`Error creating player with id ${rosterPlayer.person.id}: ${error}`);
    }
}

async function createGoalie(rosterPlayer, teamInfo) {
    const id = rosterPlayer.person.id;

    if (await Goalie.exists({ _id: id })) {
        throw new Error(`Goalie with id ${id} already exists`);
    }

    const playerDetails = await nhlStatsApi.fetchPlayerDetails(id);
    if (!playerDetails) {
        throw new Error(`Did not find details for player with id ${id}`);
    }

    if (playerDetails.primaryPosition.code !== 'G') {
        throw new Error(`Player with id ${id} is not a goalie`);
    }

    if (!playerDetails.active) {
        throw new Error(`Player with id ${id} is not active`);
    }

    const playerStats = await nhlStatsApi.fetchPlayerStats(id);
    if (!playerStats || playerStats.games < minGamesPlayed) {
        return false;
    }

    await Goalie.create({
        _id: playerDetails.id,
        name: {
            first: playerDetails.firstName,
            last: playerDetails.lastName
        },
        currentTeam: teamInfo,
        stats: {
            games: playerStats.games,
            gamesStarted: playerStats.gamesStarted,
            wins: playerStats.wins,
            losses: playerStats.losses,
            otLosses: playerStats.ot,
            shutouts: playerStats.shutouts,
            saves: playerStats.saves,
            savePercentage: playerStats.savePercentage,
            goalsAgainst: playerStats.goalsAgainst,
            goalsAgainstAverage: playerStats.goalAgainstAverage
        }
    });

    return true;
}

async function createSkater(rosterPlayer, teamInfo) {
    const id = rosterPlayer.person.id;

    if (await Skater.exists({ _id: id })) {
        throw new Error(`Skater with id ${id} already exists`);
    }

    const playerDetails = await nhlStatsApi.fetchPlayerDetails(id);
    if (!playerDetails) {
        throw new Error(`Did not find details for player with id ${id}`);
    }

    if (playerDetails.primaryPosition.code === 'G') {
        throw new Error(`Player with id ${id} is a goalie`);
    }

    if (!playerDetails.active) {
        throw new Error(`Player with id ${id} is not active`);
    }

    const playerStats = await nhlStatsApi.fetchPlayerStats(id);
    if (!playerStats || playerStats.games < minGamesPlayed) {
        return false;
    }

    await Skater.create({
        _id: playerDetails.id,
        name: {
            first: playerDetails.firstName,
            last: playerDetails.lastName
        },
        currentTeam: teamInfo,
        positions: [playerDetails.primaryPosition.abbreviation],
        stats: {
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
            timeOnIcePerGame: playerStats.timeOnIcePerGame,
            plusMinus: playerStats.plusMinus,
            penaltyMinutes: playerStats.pim,
            gameWinningGoals: playerStats.gameWinningGoals,
            faceOffPct: playerStats.faceOffPct
        }
    });

    return true;
}

async function getPlayers(page, pageSize) {
    try {
        const totalItems = await Skater.estimatedDocumentCount();
        const results = await Skater.find().skip(page * pageSize).limit(pageSize);

        return { results, totalItems };
    } catch (error) {
        winston.error(error.message);
        throw new Error(`Error retrieving players: ${error}`);
    }
}

/**
 * Given a player and information on their current team, updates their profile and stats in the database, if necessary.
 * Players will be updated who have played games since their last update, or who have changed teams, otherwise they will be ignored.
 * @param {nhlStatsApi.NhlRosterPlayer} rosterPlayer The player to update.
 * @param {object} teamInfo Information on the player's current team.
 * @param {number} teamInfo.nhlId The NHL ID of the player's current team.
 * @param {string} teamInfo.name The name of the player's current team.
 * @param {string} teamInfo.abbreviation The abbreviated name of the player's current team.
 * @returns {boolean} True if the player was updated, false if they were skipped (i.e. no update needed).
 */
async function updatePlayer(rosterPlayer, teamInfo) {
    try {
        if (rosterPlayer.position.code !== 'G') {
            return await updateSkater(rosterPlayer, teamInfo);
        } else {
            return await updateGoalie(rosterPlayer, teamInfo);
        }
    } catch (error) {
        winston.error(error.message);
        throw new Error(`Error updating player with id ${rosterPlayer.person.id}: ${error}`);
    }
}

async function updateGoalie(rosterPlayer, teamInfo) {
    const id = rosterPlayer.person.id;

    const goalie = await Goalie.findById(id);
    if (!goalie) {
        throw new Error(`Unable to find Goalie with id ${id}`);
    }

    let changesMade = false;

    if (goalie.currentTeam.nhlId !== teamInfo.nhlId) {
        // update current team for players who are traded, claimed off waivers, etc.
        goalie.currentTeam = teamInfo;
        changesMade = true;
    }

    const lastUpdateCheck = Date.now() - TWELVE_HOURS;

    if (!goalie.lastUpdate || goalie.lastUpdate < lastUpdateCheck) {
        const playerStats = await nhlStatsApi.fetchPlayerStats(id);

        if (playerStats.games !== goalie.stats.games) {
            goalie.stats = {
                games: playerStats.games,
                gamesStarted: playerStats.gamesStarted,
                wins: playerStats.wins,
                losses: playerStats.losses,
                otLosses: playerStats.ot,
                shutouts: playerStats.shutouts,
                saves: playerStats.saves,
                savePercentage: playerStats.savePercentage,
                goalsAgainst: playerStats.goalsAgainst,
                goalsAgainstAverage: playerStats.goalAgainstAverage
            };

            changesMade = true;
        }
    }

    if (changesMade) {
        goalie.lastUpdate = new Date();

        await goalie.save();
    }

    return changesMade;
}

async function updateSkater(rosterPlayer, teamInfo) {
    const id = rosterPlayer.person.id;

    const skater = await Skater.findById(id);
    if (!skater) {
        throw new Error(`Unable to find Skater with id ${id}`);
    }

    let changesMade = false;

    if (skater.currentTeam.nhlId !== teamInfo.nhlId) {
        // update current team for players who are traded, claimed off waivers, etc.
        skater.currentTeam = teamInfo;
        changesMade = true;
    }

    const lastUpdateCheck = Date.now() - TWELVE_HOURS;

    if (!skater.lastUpdate || skater.lastUpdate < lastUpdateCheck) {
        const playerStats = await nhlStatsApi.fetchPlayerStats(id);

        if (playerStats.games !== skater.stats.games) {
            skater.stats = {
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
                timeOnIcePerGame: playerStats.timeOnIcePerGame,
                plusMinus: playerStats.plusMinus,
                penaltyMinutes: playerStats.pim,
                gameWinningGoals: playerStats.gameWinningGoals,
                faceOffPct: playerStats.faceOffPct
            };

            changesMade = true;
        }
    }

    if (changesMade) {
        skater.lastUpdate = new Date();

        await skater.save();
    }

    return changesMade;
}

exports.createPlayer = createPlayer;
exports.getPlayers = getPlayers;
exports.updatePlayer = updatePlayer;
