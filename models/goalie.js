const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalieSchema = new Schema({
    _id: Number,
    name: {
        first: String,
        last: String
    },
    currentTeam: {
        nhlId: Number,
        name: String
    },
    stats: [{
        type: Schema.Types.ObjectId,
        ref: 'Goalie_Stats'
    }]
});

goalieSchema.virtual('fullName').get(function () {
    return this.name.first + ' ' + this.name.last;
});

const Goalie = mongoose.model('Goalie', goalieSchema);

module.exports = Goalie;
