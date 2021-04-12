const winston = require('winston');
const Skater = require('../models/skater');
const nhlStatsApi = require('./nhlStatsApi');

const minGamesPlayed = require('../config.json').minGamesPlayed;

const TWELVE_HOURS = 1000 * 60 * 60 * 12;

/**
 * Given a skater and information on their current team, creates their profile and stats in the database.
 * @param {nhlStatsApi.NhlRosterPlayer} rosterPlayer The player to update.
 * @param {object} teamInfo Information on the player's current team.
 * @param {number} teamInfo.nhlId The NHL ID of the player's current team.
 * @param {string} teamInfo.name The name of the player's current team.
 * @param {string} teamInfo.abbreviation The abbreviated name of the player's current team.
 * @returns {boolean} True if the player was created, false if they were skipped (i.e. not enough games played).
 */
async function createSkater(rosterPlayer, teamInfo) {
    try {
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
    } catch (error) {
        winston.error(error.message);
        throw new Error(`Error creating player with id ${rosterPlayer.person.id}: ${error}`);
    }
}

/**
 * @typedef SkaterSearchResult
 * @property {Skater[]} results The current page of matching results.
 * @property {number} totalItems The total number of matching results.
 */

/**
 * Returns a subset of the skaters that match the given parameters.
 * @param {number} page The desired page of results to retrieve.
 * @param {number} pageSize The number of results to include in the result set.
 * @param {string} position The position(s) of the players to include in the result set.
 * @param {object|string} sort The desired sort field and direction. Example 'name.last' or { 'name.last': 'asc' }.
 * @returns {SkaterSearchResult} The page of matching players found, along with a total count of all matching results.
 */
async function getSkaters(page, pageSize, position, sort) {
    try {
        const query = {};

        switch (position) {
            case 'All':
                // ignored
                break;
            case 'F':
                query.$or = [{ positions: "C" }, { positions: "LW" }, { positions: "RW" }];
                break;
            default:
                query.positions = position;
                break;
        }

        const totalItems = await Skater.countDocuments(query);
        const results = await Skater.find(query)
            .sort(sort)
            .skip(page * pageSize)
            .limit(pageSize);

        return { results, totalItems };
    } catch (error) {
        winston.error(error.message);
        throw new Error(`Error retrieving players: ${error}`);
    }
}

/**
 * Given a skater and information on their current team, updates their profile and stats in the database, if necessary.
 * Players will be updated who have played games since their last update, or who have changed teams, otherwise they will be ignored.
 * @param {nhlStatsApi.NhlRosterPlayer} rosterPlayer The player to update.
 * @param {object} teamInfo Information on the player's current team.
 * @param {number} teamInfo.nhlId The NHL ID of the player's current team.
 * @param {string} teamInfo.name The name of the player's current team.
 * @param {string} teamInfo.abbreviation The abbreviated name of the player's current team.
 * @returns {boolean} True if the player was updated, false if they were skipped (i.e. no update needed).
 */
async function updateSkater(rosterPlayer, teamInfo) {
    try {
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
    } catch (error) {
        winston.error(error.message);
        throw new Error(`Error updating player with id ${rosterPlayer.person.id}: ${error}`);
    }
}

exports.createSkater = createSkater;
exports.getSkaters = getSkaters;
exports.updateSkater = updateSkater;
