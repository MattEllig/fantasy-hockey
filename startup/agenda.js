const winston = require('winston');
const Agenda = require('agenda').default;
const Goalie = require('../models/goalie');
const Skater = require('../models/skater');
const GoalieService = require('../services/goalieService');
const SkaterService = require('../services/skaterService');
const nhlStatsApi = require('../services/nhlStatsApi');

const agenda = new Agenda({ db: { address: process.env.MONGO_URI, collection: 'agenda_jobs' } });

agenda.define('add or update players', async () => {
    if (await Skater.estimatedDocumentCount() === 0) {
        winston.info('Database not seeded yet. Skipping job');
        return;
    }

    const stats = { created: 0, updated: 0, skipped: 0 };

    const teams = await nhlStatsApi.fetchTeamsWithRoster();

    for (const team of teams) {
        const teamInfo = {
            nhlId: team.id,
            name: team.name,
            abbreviation: team.abbreviation,
        };

        for (const player of team.roster.roster) {
            if (player.position.code !== 'G') {
                const exists = await Skater.exists({ _id: player.person.id });
                if (!exists) {
                    const didCreate = await SkaterService.createSkater(player, teamInfo);

                    stats[didCreate ? 'created' : 'skipped']++;
                } else {
                    const didUpdate = await SkaterService.updateSkater(player, teamInfo);

                    stats[didUpdate ? 'updated' : 'skipped']++;
                }
            } else {
                const exists = await Goalie.exists({ _id: player.person.id });
                if (!exists) {
                    const didCreate = await GoalieService.createGoalie(player, teamInfo);

                    stats[didCreate ? 'created' : 'skipped']++;
                } else {
                    const didUpdate = await GoalieService.updateGoalie(player, teamInfo);

                    stats[didUpdate ? 'updated' : 'skipped']++;
                }
            }
        }
    }

    winston.info(`${stats.created} new, ${stats.updated} updated, ${stats.skipped} skipped`);
});

(async function () {
    await agenda.start();
    await agenda.every('8 hours', 'add or update players');

    agenda.on('start', job => winston.info(`Starting job: "${job.attrs.name}"`));
    agenda.on('complete', job => winston.info(`Finished job: "${job.attrs.name}"`));
})();
