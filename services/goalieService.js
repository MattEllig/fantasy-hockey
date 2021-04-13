const winston = require('winston');
const Goalie = require('../models/goalie');
const nhlStatsApi = require('./nhlStatsApi');

const minGamesPlayed = require('../config.json').minGamesPlayed;

const TWELVE_HOURS = 1000 * 60 * 60 * 12;

/**
 * Given a goalie and information on their current team, creates their profile and stats in the database.
 * @param {nhlStatsApi.NhlRosterPlayer} rosterPlayer The player to update.
 * @param {object} teamInfo Information on the player's current team.
 * @param {number} teamInfo.nhlId The NHL ID of the player's current team.
 * @param {string} teamInfo.name The name of the player's current team.
 * @param {string} teamInfo.abbreviation The abbreviated name of the player's current team.
 * @returns {boolean} True if the player was created, false if they were skipped (i.e. not enough games played).
 */
async function createGoalie(rosterPlayer, teamInfo) {
    try {
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
    } catch (error) {
        winston.error(error.message);
        throw new Error(`Error creating player with id ${rosterPlayer.person.id}: ${error}`);
    }
}

/**
 * @typedef GoalieSearchResult
 * @property {Goalie[]} results The current page of matching results.
 * @property {number} totalItems The total number of matching results.
 */

/**
 * Returns a subset of the goalies that match the given parameters.
 * @param {number} page The desired page of results to retrieve.
 * @param {number} pageSize The number of results to include in the result set.
 * @param {string} [search] Search terms to find a player by name with.
 * @param {object|string} sort The desired sort field and direction. Example 'name.last' or { 'name.last': 'asc' }.
 * @param {string} [team] The abbreviation of a team to find players for.
 * @returns {GoalieSearchResult} The page of matching players found, along with a total count of all matching results.
 */
async function getGoalies(page, pageSize, search, sort, team) {
    try {
        const query = {};

        if (search) {
            const searchRegex = { $regex: new RegExp(`${search}`, 'i') };

            query.$or = [{ 'name.first': searchRegex }, { 'name.last': searchRegex }];
        }

        if (team) {
            query['currentTeam.abbreviation'] = team;
        }

        const totalItems = await Goalie.countDocuments(query);
        const results = await Goalie.find(query)
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
 * Given a goalie and information on their current team, updates their profile and stats in the database, if necessary.
 * Players will be updated who have played games since their last update, or who have changed teams, otherwise they will be ignored.
 * @param {nhlStatsApi.NhlRosterPlayer} rosterPlayer The player to update.
 * @param {object} teamInfo Information on the player's current team.
 * @param {number} teamInfo.nhlId The NHL ID of the player's current team.
 * @param {string} teamInfo.name The name of the player's current team.
 * @param {string} teamInfo.abbreviation The abbreviated name of the player's current team.
 * @returns {boolean} True if the player was updated, false if they were skipped (i.e. no update needed).
 */
async function updateGoalie(rosterPlayer, teamInfo) {
    try {
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
    } catch (error) {
        winston.error(error.message);
        throw new Error(`Error updating player with id ${rosterPlayer.person.id}: ${error}`);
    }
}

exports.createGoalie = createGoalie;
exports.getGoalies = getGoalies;
exports.updateGoalie = updateGoalie;
