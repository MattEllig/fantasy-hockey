const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skaterSchema = new Schema({
    _id: Number,
    name: {
        first: String,
        last: String
    },
    currentTeam: {
        nhlId: Number,
        name: String
    },
    positions: [String],
    stats: [{
        type: Schema.Types.ObjectId,
        ref: 'Skater_Stats'
    }]
});

skaterSchema.virtual('fullName').get(function () {
    return this.name.first + ' ' + this.name.last;
});

skaterSchema.virtual('position').get(function () {
    return this.positions.join('/');
});

const Skater = mongoose.model('Skater', skaterSchema);

module.exports = Skater;
