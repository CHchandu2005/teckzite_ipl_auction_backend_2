const mongoose = require("mongoose");
const Player = require("../model/Players");
const teamSchema = new mongoose.Schema({
  teamMembers: {
    type: [
      {
        type: String,
        required: true,
      },  
    ],
    validate: [ 
      {
        validator: function (arr) {
          return arr.length >= 3; // Minimum length validation
        },
        message: "At least three team member is required",
      },
      {
        validator: function (arr) {
          return arr.length <= 5; // Maximum length validation (for example, 5 members maximum)
        },
        message: "Maximum team size exceeded",
      },
    ],
  },
  initialPurse: {
    type: Number,
    default: 10000,
  },
  teamID: {
    type: String,
    unique: true,
  },
  bowlers: {
    type: Number,
    default: 0,
  },
  batsmen: {
    type: Number,
    default: 0,
  },
  allrounder: {
    type: Number,
    default: 0,
  },
  wicketkeeper: {
    type: Number,
    default: 0,
  },
  remainingPurse: {
    type: Number,
    default: function () {
      return this.initialPurse;
    },
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
});
const Team = mongoose.model("Team", teamSchema);
module.exports = Team;