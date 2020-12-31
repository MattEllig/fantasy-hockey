const winston = require('winston');
const Skater = require('../models/skater');
const GoalieService = require('../services/goalieService');
const SkaterService = require('../services/skaterService');
const nhlStatsApi = require('../services/nhlStatsApi');

const MIN_GAMES_PLAYED = 10;

(async function seedDatabase() {
    const skaterCount = await Skater.estimatedDocumentCount();
    if (skaterCount > 0) {
        // don't bother seeding if there's already any data
        return;
    }

    try {
        const teams = require('./teams.json');

        winston.info('Seeding player collections...');

        for (let i = 0; i < teams.length; i++) {
            const id = teams[i].id;

            winston.info(`Seeding team ${i + 1} of ${teams.length}`);

            const roster = await nhlStatsApi.fetchTeamRoster(id);
            if (!roster) {
                throw new Error(`No team found with ID ${id}`);
            }

            const skaterIds = roster.filter(rp => rp.position.code !== 'G').map(rp => rp.person.id);
            const goalieIds = roster.filter(rp => rp.position.code === 'G').map(rp => rp.person.id);

            await SkaterService.createMany(skaterIds, MIN_GAMES_PLAYED);
            await GoalieService.createMany(goalieIds, MIN_GAMES_PLAYED);
        }

        winston.info('Done seeding players');
    } catch (error) {
        winston.error(error);
    }
})();
