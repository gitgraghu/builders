var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name:   String,
    builder:String,
    type:   String,
    status: String,
    area:   String,
    completionyear: Number,
    numfloors: Number,
    numunits: Number,
    cost: Number,
    location: {type: [Number]},
    sqft1: Number,
    sqft2: Number,
    oneBHK: {type: Boolean, default: false},
    numoneBHK: {type:Number, default: 0},
    twoBHK: {type: Boolean, default: false},
    numtwoBHK: {type:Number, default: 0},
    threeBHK: {type: Boolean, default: false},
    numthreeBHK: {type:Number, default: 0},
    fourBHK: {type: Boolean, default: false}
    numfourBHK: {type:Number, default:0}
})

ProjectSchema.index({location: '2dsphere'});

module.exports = mongoose.model('Project', ProjectSchema);
