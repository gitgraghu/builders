var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name:           String,
    builder:        String,
    type:           String,
    status:         String,
    area:           String,
    sqft:           Number,
    cost:           Number,
    completionyear: Number,
    totalunits:     Number,
    numfloors:      Number,
    numunits:       Number,
    location:      [Number],
    BHK:            Number,
    totalcost:      Number
});

ProjectSchema.index({location: '2dsphere'});

module.exports = mongoose.model('Project', ProjectSchema);
