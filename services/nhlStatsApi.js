const axios = require('axios').default;

const nhlStatsApi = axios.create({
    baseURL: 'https://statsapi.web.nhl.com/api/v1'
});

/**
 * Player details object returned by the NHL Stats API.
 * @typedef {object} NhlPlayerDetails
 * @property {number} id The player's NHL ID.
 * @property {string} fullName The player's full name.
 * @property {string} link The player's NHL People API link.
 * @property {string} firstName The player's first name.
 * @property {string} lastName The player's last name.
 * @property {string} primaryNumber The player's primary jersey number.
 * @property {string} birthDate The player's date of birth.
 * @property {number} [currentAge] The player's current age in years.
 * @property {string} birthCity The name of the city the player was born in.
 * @property {string} [birthStateProvince] An ISO code identifying the State/Province the player was born in, if applicable (e.g. "MB" for Manitoba).
 * @property {string} birthCountry An ISO code identifying the country the player was born in (e.g. "DEU" for Germany).
 * @property {string} nationality An ISO code identifying the nationality of the player.
 * @property {string} height The player's height in feet and inches.
 * @property {number} weight The player's weight in pounds.
 * @property {boolean} active A value indicating whether or not the player is currently active in the NHL.
 * @property {boolean} [alternateCaptain] A value indicating whether or not the player is an alternate captain for their current team.
 * @property {boolean} [captain] A value indicating whether or not the player is the captain of their current team.
 * @property {boolean} rookie A value indicating whether or not the player is considered to be a rookie in the NHL.
 * @property {string} shootsCatches The handedness of the player for either shooting (skaters) or catching (goalies) (e.g. "L" for left).
 * @property {string} rosterStatus "Y" or "N" for if the player is eligible to be on a roster (I think?).
 * @property {object} [currentTeam] Information on the player's current team, if any.
 * @property {number} currentTeam.id The ID of the player's current team.
 * @property {string} currentTeam.name The name of the player's current team.
 * @property {string} currentTeam.link The team's NHL Team API link.
 * @property {object} primaryPosition Information on the player's primary position.
 * @property {string} primaryPosition.code A code identifying the player's primary position (e.g. "C" for Center).
 * @property {string} primaryPosition.name The name of the player's primary position (e.g. "Center").
 * @property {string} primaryPosition.type The category the player's primary position belongs to (e.g. "Forward", "Defenseman", "Goalie").
 * @property {string} primaryPosition.abbreviation An abbreviation of the player's primary position (e.g. "RW" for Right Wing).
 */

/**
 * Returns general details for a player by their NHL ID.
 * @param {number} playerId A valid NHL player ID.
 * @returns {Promise<NhlPlayerDetails|null>} The player's details or null if they weren't found.
 */
async function fetchPlayerDetails(playerId) {
    const result = await nhlStatsApi.get(`/people/${playerId}`);

    return result.data.people ? result.data.people[0] : null;
}

/**
 * Skater or goalie stats object returned by the NHL Stats API, representing the stats for one season.
 * @typedef {object} NhlPlayerStats
 * @property {string} season The season the player's stats represent.
 * @property {number} games The player's games played total.
 * @property {string} timeOnIce The player's total time on ice.
 * @property {string} timeOnIcePerGame The player's average total time on ice per game.
 * @property {number} [assists] The skater's assists total.
 * @property {number} [goals] The skater's goals total.
 * @property {number} [pim] The skater's penalty minutes total.
 * @property {number} [shots] The skater's shots on net total.
 * @property {number} [hits] The skater's hits total.
 * @property {number} [powerPlayGoals] The skater's powerplay goals total.
 * @property {number} [powerPlayPoints] The skater's powerplay points total.
 * @property {string} [powerPlayTimeOnIce] The skater's total powerplay time on ice.
 * @property {string} [evenTimeOnIce] The skater's total even strength time on ice.
 * @property {string} [penaltyMinutes] The skater's penalty minutes total.
 * @property {number} [faceOffPct] The skater's faceoff win%.
 * @property {number} [shotPct] The skater's shooting%.
 * @property {number} [gameWinningGoals] The skater's game winning goals total.
 * @property {number} [overTimeGoals] The skater's overtime goals total.
 * @property {number} [shortHandedGoals] The skater's short-handed goals total.
 * @property {number} [shortHandedPoints] The skater's short-handed points total.
 * @property {string} [shortHandedTimeOnIce] The skater's total short-handed time on ice.
 * @property {number} [blocked] The skater's blocked shots total.
 * @property {number} [plusMinus] The skater's +/- rating.
 * @property {number} [points] The skater's point total.
 * @property {number} [shifts] The skater's shifts count.
 * @property {string} [evenTimeOnIcePerGame] The skater's average even strength time on ice per game.
 * @property {string} [shortHandedTimeOnIcePerGame] The skater's average short-handed time on ice per game.
 * @property {string} [powerPlayTimeOnIcePerGame] The skater's average powerplay time on ice per game.
 * @property {number} [ot] The goalie's number of overtime losses.
 * @property {number} [shutouts] The goalie's shutout total.
 * @property {number} [ties] The goalie's number of tie games.
 * @property {number} [wins] The goalie's number of wins.
 * @property {number} [losses] The goalie's number of losses.
 * @property {number} [saves] The goalie's saves total.
 * @property {number} [powerPlaySaves] The goalie's powerplay saves total.
 * @property {number} [shortHandedSaves] The goalie's short-handed saves total.
 * @property {number} [evenSaves] The goalie's even strength saves total.
 * @property {number} [shortHandedShots] The goalie's total number of short-handed shots faced.
 * @property {number} [evenShots] The goalie's total number of even strength shots faced.
 * @property {number} [powerPlayShots] The goalie's total number of powerplay shots faced.
 * @property {number} [savePercentage] The goalie's save percentage.
 * @property {number} [goalAgainstAverage] The goalie's goals against average.
 * @property {number} [gamesStarted] The goalie's games started total.
 * @property {number} [shotsAgainst] The goalie's total number of shots faced.
 * @property {number} [goalsAgainst] The goalie's total number of goals allowed.
 * @property {number} [powerPlaySavePercentage] The goalie's powerplay save percentage.
 * @property {number} [shortHandedSavePercentage] The goalie's short-handed save percentage.
 * @property {number} [evenStrengthSavePercentage] The goalie's even strength save percentage.
 */

/**
 * Returns season statistics for a player by their NHL ID and season identifier.
 * @param {number} playerId A valid NHL player ID.
 * @param {string} season The season to retrieve stats for (e.g. "20192020").
 * @returns {Promise<NhlPlayerStats|null>} The player's stats for the given season or null if they weren't found or didn't play that season.
 */
async function fetchPlayerStatsForSeason(playerId, season) {
    const result = await nhlStatsApi.get(`/people/${playerId}/stats`, {
        params: {
            stats: 'statsSingleSeason',
            season
        }
    });

    return result.data.stats && result.data.stats[0].splits.length > 0
        ? { season, ...result.data.stats[0].splits[0].stat }
        : null;
}

/**
 * Summarized player details for identifying a player on an NHL team roster.
 * @typedef {object} NhlRosterPlayer
 * @property {object} person Details about the player.
 * @property {number} person.id The player's NHL ID.
 * @property {string} person.fullName The player's full name.
 * @property {string} person.link The player's NHL People API link.
 * @property {string} jerseyNumber The player's current jersey number.
 * @property {object} position Information on the player's primary position.
 * @property {string} position.code A code identifying the player's primary position (e.g. "C" for Center).
 * @property {string} position.name The name of the player's primary position (e.g. "Center").
 * @property {string} position.type The category the player's primary position belongs to (e.g. "Forward", "Defenseman", "Goalie").
 * @property {string} position.abbreviation An abbreviation of the player's primary position (e.g. "RW" for Right Wing).
 */

/**
 * Team details object returned by the NHL Stats API.
 * @typedef NhlTeamDetails
 * @property {number} id The team's NHL ID.
 * @property {string} name The name of the team.
 * @property {string} link The team's NHL Team API link.
 * @property {object} venue Information on the team's venue.
 * @property {string} venue.name The name of the venue.
 * @property {string} venue.link The venue's NHL Venues API link.
 * @property {string} venue.city The name of the city the venue is in.
 * @property {object} venue.timeZone Information on the timezone the venue is in.
 * @property {string} venue.timeZone.id An identifier for the timezone.
 * @property {number} venue.timeZone.offset The UTC offset of the timezone.
 * @property {string} venue.timeZone.tz The timezone's code (e.g. EST for Eastern time).
 * @property {string} abbreviation The team's name abbreviation.
 * @property {string} teamName The team's name without location (e.g. "Devils" for the New Jersey Devils).
 * @property {string} locationName The team's location (e.g. "New Jersey" for New Jersey Devils).
 * @property {string} firstYearOfPlay The team's first year in the NHL.
 * @property {object} division Information on the NHL division the team belongs to.
 * @property {number} division.id The division's NHL ID.
 * @property {string} division.name The division's name.
 * @property {string} division.link The division's NHL Divisions API link.
 * @property {object} conference Information on the NHL conference the team belongs to.
 * @property {number} conference.id The conference's NHL ID.
 * @property {string} conference.name The conference's name.
 * @property {string} conference.link The conference's NHL Conferences API link.
 * @property {object} franchise Information on the team's franchise.
 * @property {number} franchise.franchiseId The franchise's NHL ID.
 * @property {string} franchise.teamName The franchise's team name.
 * @property {string} franchise.link The franchise's NHL Franchises API link.
 * @property {object} roster The team's roster.
 * @property {NhlRosterPlayer[]} roster.roster The team's roster.
 * @property {string} shortName The team's shortened name (e.g. "New Jersey" for the New Jersey Devils).
 * @property {string} officialSiteUrl The URL of the team's official website.
 * @property {number} franchiseId The team's NHL franchise ID.
 * @property {boolean} active A value indicating whether or not the team is currently active in the league.
 */

/**
 * Returns a list of all current NHL teams and their roster.
 * @returns {Promise<NhlTeamDetails[]>} An array with details on all currently active teams and their rosters.
 */
async function fetchTeamsWithRoster() {
    const result = await nhlStatsApi.get('/teams?expand=team.roster');

    return result.data.teams;
}

exports.fetchPlayerDetails = fetchPlayerDetails;
exports.fetchPlayerStatsForSeason = fetchPlayerStatsForSeason;
exports.fetchTeamsWithRoster = fetchTeamsWithRoster;
