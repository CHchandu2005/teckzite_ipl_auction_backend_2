const mongoose = require('mongoose');
const playerSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true,
        unique: true
    },
    "nationality": {
        type: String,
        required: true
    },
    "age": {
        type: Number,
        required: true
    },
    "role": {
        type: String, 
        required: true,
        enum:{
            values:["batsman","bowler","wicketkeeper","allrounder"],
            message:"The player must be either batsman or bowler or wicketkeeper or allrounder"
        }
    },
    "runs": {
        type: Number,
        required: false
    },
    "wickets": {
        type: String,
        required: false
    },
    "set":{
        type: Number,
        required: true
    },
    "setname":{
        type:String,
        required:true
    },
    "image": {
        type: String,  // Storing the file itself as binary data
        
      },
    "basePrice": {
        type: Number,
        default: 50000
    },
    "strikeRate": {
        type: String,
        required: false
    },
    "isSold":{
        type:Boolean,
        default:false
    },
    "inAuction":{
        type:Boolean,
        default:false,
    },
    "soldTeam":{
        type:String,
        default:null
    },

    "soldAmount":{
        type:Number,
        // default:function(){
        //     return this.basePrice
        // }
    },
    "bidplace":{
        type:Number,
    },
    "ipl":{
        type:String,
    },
    "economy":{
        type:String,
    },
    "average":{
        type:String,
    },
    "inaccelerate":{
      type:Boolean,
      default:false
    },
});
const Player = mongoose.model('Player', playerSchema);
module.exports = Player