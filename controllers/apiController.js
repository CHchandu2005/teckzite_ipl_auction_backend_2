require('dotenv').config();
const ExcelJS = require("exceljs");

const { trusted } = require('mongoose');
const Player = require('../model/Players');
const Team = require('../model/Teams');
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage });


const getplayers = async(req,res)=>{
  console.log("in get players");
    try{
        const players=await Player.find({})
        if(players.length>0){

            res.status(200).send(players)
        }
        else{
            res.status(200).send({message:"No players found"})
        }
    }
    catch(err){
        console.log(err)
        res.status(400).send(err)
    }
}
const playersToBuy = async (req, res) => {
  console.log("In playersToBuy function");
  try {
    const {  set,bidplace, direction } = req.query;
console.log(set)
   
    const bidPlaceValue = parseInt(bidplace, 10);
    const setValue = parseInt(set, 10);

    let sortOrder = 1;
    let query = { isSold: { $ne: true },inAuction:{$ne:true},set:setValue};

    if (direction === "next") {
      query = {
        ...query,
         
          set: setValue, bidplace: { $gt: bidPlaceValue } ,
        
      };

      sortOrder = 1; 

    } else if (direction === "prev") {
      query = {
        ...query,
        
        set: setValue, bidplace: { $lt: bidPlaceValue } ,
        
      };
      sortOrder = -1; // Descending order for "prev"
    }

    
    let players = await Player.find(query)
      .sort({  bidplace: sortOrder })
      .limit(1);

    if (players.length > 0) {
      console.log("Player fetched:", players[0]);
      return res.status(200).send(players[0]); 
    }

    // If no players are found, wrap around for cyclic behavior
    console.log("No players found. Wrapping around for cyclic behavior...");
    if (direction === "next") {
      query = {
        isSold: { $ne: true },
         inAuction:{$ne:true},
         
         set: setValue, bidplace: { $lte: bidPlaceValue } 
      };
      sortOrder = 1; 


    } else if (direction === "prev") {
      query = {
        isSold: { $ne: true },
       inAuction:{$ne:true},
       set: setValue, bidplace: { $gte: bidPlaceValue } 
      };
      sortOrder = -1; 
    }

    players = await Player.find(query)
      .sort({  bidplace: sortOrder })
      .limit(1);

    if (players.length > 0) {
      console.log("Player fetched after wrapping:", players[0]);
     
      res.status(200).send(players[0]); // Send the player data
    } else {
      res.status(200).send("No available players to sell...");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
const accelerateplayers = async (req, res) => {
    console.log("In accelerate function");
    console.log(req.body)
    try {
      const {  set,bidplace, direction } = req.query;
  console.log(set)
     
      const bidPlaceValue = parseInt(bidplace, 10);
      const setValue = parseInt(set, 10);
  
      let sortOrder = 1;
      let query = { isSold: { $ne: true },inAuction:{$ne:false},inaccelerate:{$ne:true}};
  
      if (direction === "next") {
        query = {
          ...query,
           
            set:{$gte: setValue}, bidplace: { $gt: bidPlaceValue } ,
          
        };
  
        sortOrder = 1; 
  
      } else if (direction === "prev") {
        query = {
          ...query,
          
          set:{$lte: setValue}, bidplace: { $lt: bidPlaceValue } ,
          
        };
        sortOrder = -1; // Descending order for "prev"
      }
  
      
      let players = await Player.find(query)
        .sort({  bidplace: sortOrder })
        .limit(1);
  
      if (players.length > 0) {
        console.log("Player fetched:", players[0]);
        return res.status(200).send(players[0]); 
      }
  
      // If no players are found, wrap around for cyclic behavior
      console.log("No players found. Wrapping around for cyclic behavior...");
      if (direction === "next") {
        query = {
          isSold: { $ne: true },
           inAuction:{$ne:false},
           inaccelerate:{$ne:true},
           set: {$lte:setValue}, bidplace: { $lte: bidPlaceValue } 
        };
        sortOrder = 1; 
  
  
      } else if (direction === "prev") {
        query = {
          isSold: { $ne: true },
         inAuction:{$ne:false},
         inaccelerate:{$ne:true},
         set:{$gte: setValue}, bidplace: { $gte: bidPlaceValue } 
        };
        sortOrder = -1; 
      }
  
      players = await Player.find(query)
        .sort({  bidplace: sortOrder })
        .limit(1);
      if (players.length > 0) {
        console.log("Player fetched after wrapping:", players[0]);
       
        res.status(200).send(players[0]); // Send the player data
      } else {
        res.status(200).send("No available players to sell...");
      }
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  };


const soldPlayers = async(req,res)=>{
    try{
        const players=await Player.find({isSold:{$eq:true}})
        res.status(200).send(players)
    }
    catch(err){
        console.log(err)
        res.status(400).send(err)
    }
}
const unsold=async(req,res)=>{
  console.log("unsold")
  const id=req.body.id;
  const inaccelerate=req.body.inaccelerate
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).send({ message: "Player not found" });
    }else{ 
  player.inAuction=true;
  if(inaccelerate){
    player.inaccelerate=true;
  }
  await player.save();
  return res.status(200).send({message:"unsold"})
    }
}
const getTeams = async(req,res)=>{
    try{
        const teams=await Team.find()
        res.status(200).send(teams)
    }
    catch(err){
        console.log(err)
        res.status(400).send(err)
    }
}

const player = async (req, res) => {
  try {
    console.log("Player function:", req.body);

    const {
      name,
      nationality,
      age,
      role,
      runs,
      wickets,
      strikeRate,
      basePrice,
      ipl,
      economy,
      average,
      bidplace,
      set,
      setname
    } = req.body;

    let image;
    if (req.file == undefined) {
      image = req.body.image;
    } else {
      image = req.file;

      if (!image) {
        return res.status(400).send('No image file uploaded');
      }

      // Upload image to Cloudinary with 1:1 aspect ratio
      console.log("Uploading image...");
      const uploadImage = await import('../uploadimage.mjs');

      try {
        const uploadedImageUrl = await uploadImage.uploadImages(image, {
          transformation: [
            { width: 500, height: 500, crop: "fill", gravity: "auto" } // Ensures 1:1 aspect ratio
          ]
        });

        console.log("Uploaded Image URL:", uploadedImageUrl);
        image = uploadedImageUrl;
      } catch (err) {
        console.log("Error while uploading photo");
        return res.status(500).send({ message: 'Error while uploading photo' });
      }
    }

    const id = req.body._id;
    if (id) {
      const existingPlayer = await Player.findOne({ _id: id });
      console.log(id);
      console.log(existingPlayer);

      if (existingPlayer) {
        console.log("Updating existing player...");
        existingPlayer.name = name;
        existingPlayer.nationality = nationality;
        existingPlayer.age = age;
        existingPlayer.role = role;
        existingPlayer.runs = runs;
        existingPlayer.wickets = wickets;
        existingPlayer.strikeRate = strikeRate;
        existingPlayer.image = image; // Save Cloudinary URL
        existingPlayer.basePrice = basePrice;
        existingPlayer.ipl = ipl;
        existingPlayer.economy = economy;
        existingPlayer.average = average;
        existingPlayer.bidplace = bidplace;
        existingPlayer.set = set;
        existingPlayer.setname = setname;

        const updatedPlayer = await existingPlayer.save();
        console.log("Player updated successfully");
        return res.status(200).send({ message: 'Player updated successfully', player: updatedPlayer });
      }
    } else {
      console.log("Adding new player...");
      const newPlayer = new Player({
        name,
        nationality,
        age,
        role,
        runs,
        wickets,
        strikeRate,
        image, // Save Cloudinary URL
        basePrice,
        ipl,
        economy,
        average,
        bidplace,
        set,
        setname,
      });

      await newPlayer.save();
      return res.status(200).json({ message: 'Player added successfully' });
    }
  } catch (error) {
    console.log('Error in player function:', error);
    return res.status(500).send('Error processing request');
  }
};


const createTeam = async (req, res) => {
    try {
      console.log("create team function");
  
      const { teamID, teamMembers } = req.body;
  
      // Check if a team with the same teamID already exists
      console.log(teamID)
      const existingTeam = await Team.findOne({ teamID });
  
      if (existingTeam) {
        // If the team exists, update its fields with the new data
        existingTeam.teamMembers = teamMembers;
        // existingTeam.initialPurse = initialPurse;
  
        const updatedTeam = await existingTeam.save();
        return res.status(200).send({ message: "Team updated successfully", team: updatedTeam });
      } else {
        // If the team doesn't exist, create a new team
        const team = new Team(req.body);
        const teamSave = await team.save();
        return res.status(201).send({ message: "Team created successfully", team: teamSave });
      }
    } catch (err) {
      console.log(error)
      res.status(400).send({ message: "Error creating or updating team", error: err });
    }
  };
//   const deleteplayerfromteam=async(req,res)=>{
//       console.log("in del  player from team");
//       try{
// const {id}=req.body;
// const player=await Player.findById(id);
// if (!player) {
//   return res.status(404).json({ error: "Player not found." });
// }
// const team=await Team.find({teamID:player.soldTeam});
// if (!team) {
//    return res.status(404).json({error:"Team not found"})
//       }
//       team.remainingPurse+=player.soldAmount;
//        const role=player.role;
//       if (role === "batsman") {
//         console.log("batsman")
//         team.batsmen -= 1;
//       } else if (role === "bowler") {
//         team.bowlers -= 1;
//       } else if (role === "allrounder") {
//         team.allrounder -= 1;
//       } else if (role === "wicketkeeper") {
//         team.wicketkeeper -= 1;
//       }
//       await Team.updateOne({ teamID: player.soldTeam }, { $pull: { players: id } });
//       player.isSold=false;
//       player.inAuction=false;
//       player.soldTeam=null;
//       player.soldAmount=0;
//       player.inaccelerate=false;

//     }

//   }
const deleteplayerfromteam = async (req, res) => {
  console.log("In delete player from team");

  try {
    const { id } = req.body;

    // Find the player by ID
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ error: "Player not found." });
    }

    // Find the team associated with the player
    const team = await Team.findOne({ teamID: player.soldTeam });
    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    // Update team's remaining purse
    team.remainingPurse += player.soldAmount;

    // Update team's player count based on role
    const role = player.role;
    if (role === "batsman") {
      console.log("batsman");
      team.batsmen -= 1;
    } else if (role === "bowler") {
      team.bowlers -= 1;
    } else if (role === "allrounder") {
      team.allrounder -= 1;
    } else if (role === "wicketkeeper") {
      team.wicketkeeper -= 1;
    }

    // Remove player from the team's players list
    await Team.updateOne({ teamID: player.soldTeam }, { $pull: { players: id } });

    // Reset player attributes
    player.isSold = false;
    player.inAuction = false;
    player.soldTeam = null;
    player.soldAmount = 0;
    player.inaccelerate = false;

    // Save updates
    await player.save();
    await team.save();

    return res.status(200).json({ message: "Player removed from team successfully." });
  } catch (error) {
    console.error("Error removing player from team:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const bid = async (req, res) => {
  console.log("In bid function");

  const { teamName, playerId, biddingAmount } = req.body;
  console.log("Bid details:", teamName, playerId, biddingAmount);

  try {
    // Find the team
    const team = await Team.findOne({ teamID: teamName });
    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    // Find the player
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: "Player not found." });
    }

    // Check if player is already sold
    if (player.isSold) {
      return res.status(400).json({ error: "Player already sold." });
    }

    // Check if the player is already in the team
    if (team.players.some(id => id.toString() === playerId.toString())) {
      return res.status(400).json({ error: "Player already present in the team." });
    }

    // Check if the team has enough balance
    if (team.remainingPurse < biddingAmount) {
      return res.status(400).json({ error: "Insufficient balance to buy this player." });
    }

    // Deduct the bidding amount
    team.remainingPurse -= biddingAmount;
    team.players.push(playerId);

    // Update the team's player count based on role
    if (player.role === "batsman") {
      team.batsmen += 1;
    } else if (player.role === "bowler") {
      team.bowlers += 1;
    } else if (player.role === "allrounder") {
      team.allrounder += 1;
    } else if (player.role === "wicketkeeper") {
      team.wicketkeeper += 1;
    }

    // Update player details
    player.soldAmount = biddingAmount;
    player.isSold = true;
    player.soldTeam = teamName;

    // Ensure Mongoose detects changes
    player.markModified("soldAmount");
    player.markModified("isSold");
    player.markModified("soldTeam");

    console.log("Updated Player object:", player);

    // Save changes
    await player.save();
    await team.save();

    return res.status(200).json({ message: "Bid successful", team });
  } catch (error) {
    console.error("Error in bid function:", error);
    return res.status(500).json({ error: error.message });
  }
};



  const fetchsets = async (req, res) => {
    console.log("in fetchsets");
    try {
      const setsWithPlayersAgg = await Player.aggregate([
        { $match: { isSold: false, inAuction: false } },
        { 
          $group: { 
            _id: "$set", 
            setname: { $first: "$setname" } 
          } 
        }
      ]);
  
      const setsWithoutPlayersAgg = await Player.aggregate([
        {
          $group: {
            _id: "$set",
            setname: { $first: "$setname" },
            totalPlayers: { $sum: 1 },
            matchingPlayers: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ["$isSold", true] },  
                      { $and: [{ $eq: ["$isSold", false] }, { $eq: ["$inAuction", true] }] } 
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $match: {
            $expr: { $eq: ["$totalPlayers", "$matchingPlayers"] } // Only keep sets where all players match the condition
          }
        }
      ]);
  
      console.log(setsWithPlayersAgg, setsWithoutPlayersAgg);
  
      // Convert aggregation results to structured arrays
      let setsWithPlayers = setsWithPlayersAgg.map(doc => ({
        set: doc._id,
        setname: doc.setname
      }));
  
      let setsWithoutPlayers = setsWithoutPlayersAgg.map(doc => ({
        set: doc._id,
        setname: doc.setname
      }));
  
      // Sort the sets by numerical order if setnames contain numbers
      const sortBySetNumber = (a, b) => {
        const numA = parseInt(a.setname.replace(/\D/g, ""), 10) || 0; // Extract number from "Set 1"
        const numB = parseInt(b.setname.replace(/\D/g, ""), 10) || 0;
        return numA - numB;
      };
  
      setsWithPlayers.sort(sortBySetNumber);
      setsWithoutPlayers.sort(sortBySetNumber);
  
      // Fetch team names
      const teams = await Team.find({}, 'teamID');
      const teamnames = teams.map(team => team.teamID);
  
      res.status(200).json({
        // Sorted arrays for sets that have unsold players.
        setname: setsWithPlayers.map(item => item.setname), 
        set: setsWithPlayers.map(item => item.set),
  
        // Sorted arrays for sets that do not have unsold players.
        setwithoutplayers_set: setsWithoutPlayers.map(item => item.set),       
        setwithoutplayers_setname: setsWithoutPlayers.map(item => item.setname), 
  
        teamnames
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch sets" });
    }
  };
  
  

const deleteTeam = async (req, res) => {
  const { id } = req.body;
  console.log("id:", id);
  
  try {
      const team = await Team.findById(id);
      if (!team) {
          return res.status(404).send({ message: "Team not found" });
      }

      // Get all player IDs from the team's players array
      const playerIds = team.players;

      // Find all players associated with the team
      const players = await Player.find({ _id: { $in: playerIds } });

      // Update each player individually to reset their auction status
      for (const player of players) {
          player.isSold = false;
          player.inAuction = false;
          player.soldTeam = null;
          player.soldAmount = player.basePrice; // Reset soldAmount to basePrice
          await player.save();
      }

      // Delete the team
      await Team.findByIdAndDelete(id);

      res.status(200).send({ message: "Team deleted successfully, players updated." });
  } catch (err) {
      console.log(err);
      res.status(400).send({ message: "Error deleting team", error: err });
  }
};


const getteamplayers = async (req, res) => {
  try {
    console.log("getteamplayers function: Team ID:", req.params.id);

    // Step 1: Find the Team document by its ID and retrieve the players array (IDs of players)
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const playerIds = team.players; // Extract the array of player IDs from the team document

    // Step 2: Find the player documents using the array of player IDs
    const players = await Player.find({ _id: { $in: playerIds } });

    // Step 3: Send the players as a JSON response
    res.json(players);
  } catch (err) {
    // Handle any errors
    console.error("Error in getteamplayers function:", err);
    res.status(400).json({ error: err.message });
  }
};
const deletePlayer = async (req, res) => { 
  const { id } = req.body;
  console.log(req.body);
  console.log("id:", id);

  try {
    const player = await Player.findByIdAndDelete(id);
    if (!player) {
      return res.status(404).send({ message: "Player not found" });
    }

    // If the player was sold, update the respective team's purse and remove the player from the team
    if (player.isSold) {
      const teamName = player.soldTeam;
      const soldAmount = player.soldAmount;
      const role = player.role;
      
      const team = await Team.findOne({ teamID: teamName });
      if (!team) {
        return res.status(404).send({ message: "Team not found" });
      }

      // Remove player _id from team's players array
      await Team.updateOne({ teamID: teamName }, { $pull: { players: id } });

      // Update team purse and player count based on role
      team.remainingPurse += soldAmount;
      if (role === "batsman") {
        console.log("batsman")
        team.batsmen -= 1;
      } else if (role === "bowler") {
        team.bowlers -= 1;
      } else if (role === "allrounder") {
        team.allrounder -= 1;
      } else if (role === "wicketkeeper") {
        team.wicketkeeper -= 1;
      }

      await team.save();
      console.log(`Updated team purse for ${teamName}, added back ${soldAmount}`);
    }

    console.log("Deleted player details", player);
    res.status(200).send({ message: "Player deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Error deleting player", error: err });
  }
};

// const addset = async (req, res) => {
//   try {
//     console.log("add set function started");

//     const { setname, setno } = req.body;
//     console.log("Set Name:", setname);
//     console.log("Set Number:", setno);

//     if (!req.file || !req.file.buffer) {
//       console.log("No file uploaded");
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.load(req.file.buffer);

//     const players = [];
//     // const validRoles = ["batsman", "bowler", "wicketkeeper", "allrounder"];

//     workbook.eachSheet((worksheet, sheetId) => {
//       console.log(`Processing Sheet ${sheetId}: ${worksheet.name}`);

//       let headers = [];
//       worksheet.eachRow((row, rowNumber) => {
//         if (rowNumber === 1) {
//           headers = row.values.map((val) => val?.toString().trim().toLowerCase()); // Extract header row
//           return;
//         }

//         const playerData = {};
//         row.eachCell((cell, colNumber) => {
//           const key = headers[colNumber]; 
//           console.log("key"+key)
//           if (key) playerData[key] = cell.value;
          
//         });
        
       
//         // Convert & validate values


//         // console.log("Players data:",playerData);
//         playerData.age = parseInt(playerData.age, 10);
//         // console.log("age"+playerData.age)
//         playerData.runs = playerData.runs ? parseInt(playerData.runs, 10) : undefined;
//         playerData.wickets = playerData.wickets ? parseInt(playerData.wickets, 10) : undefined;
//         playerData.set = playerData["set no."]?parseInt(playerData["set no."], 10):0;
//         playerData.isDebut = playerData.isdebut?.toString().trim().toUpperCase() === "TRUE";
//         playerData.basePrice = playerData["base price"] ? parseInt(playerData["base price"], 10) : 50000;
//         playerData.bidplace = playerData["s.no"]? parseInt(playerData["s.no"], 10) : undefined;
//         playerData.setname = "set"+parseInt(playerData["s.no"], 10);
//         playerData.role = playerData.specialism ? String(playerData.specialism).toLowerCase() : "";
//         playerData.strikeRate=playerData.strikerate?String(playerData.strikerate):"";
//         playerData.nationality=playerData.country?String(playerData.country):undefined;
//         playerData.name=playerData["first name"]&&playerData.surname?String(playerData["first name"]+playerData.surname):undefined;
//       //  console.log(playerData.name,playerData.nationality,playerData.age,playerData.role)
//         // Validate required fields
//         // if (!playerData.name || !playerData.nationality || isNaN(playerData.age) || !playerData.role) {
//         //   console.log(`Skipping row ${rowNumber} in sheet ${worksheet.name} due to missing data`);
//         //   return;
//         // }

//         // if (!validRoles.includes(playerData.role)) {
//         //   console.log(`Invalid role in row ${rowNumber}, sheet ${worksheet.name}: ${playerData.role}`);
//         //   return;
//         // }
       
//         players.push(playerData);
//       });
//     });

//     console.log(`Total players parsed: ${players.length}`);

//     // console.log("Total players data:",players);

//     if (players.length > 0) {
//       await Player.insertMany(players);
//       console.log(`${players.length} players inserted into the database.`);
//     }

//     res.status(200).json({
//       message: "Data received successfully and inserted into the database",
//       data: {
//         setname,
//         setno,
//         file: req.file.originalname,
//       },
//     });
//   } catch (error) {
//     console.error("Error in add set function:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const addset = async (req, res) => {
  try {
    console.log("addset function started");

    const { setname, setno } = req.body;
    console.log("Set Name:", setname || "N/A");
    console.log("Set Number:", setno || "N/A");

    if (!req.file || !req.file.buffer) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const players = [];
    workbook.eachSheet((worksheet, sheetId) => {
      console.log(`Processing Sheet ${sheetId}: ${worksheet.name}`);

      let headers = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          headers = row.values
            .map((val) =>
              val && typeof val === "object" && val.text
                ? val.text.toString().trim().toLowerCase()
                : val
                ? val.toString().trim().toLowerCase()
                : ""
            )
            .filter(Boolean);
          return;
        }

        // console.log("Headers:", headers);

        const playerData = {};
        row.eachCell((cell, colNumber) => {
          const key = headers[colNumber - 1];
          if (key) {
            playerData[key] = cell.value ? cell.value.toString().trim() : "";
          }
        });
        const player = {};

player.age = playerData.age ? parseInt(playerData.age, 10) || 0 : 0;
player.runs = playerData.runs ? parseInt(playerData.runs, 10) || 0 : 0;
player.wickets = playerData.wickets ? parseInt(playerData.wickets, 10) || 0 : 0;
player.set = playerData["set no."] ? parseInt(playerData["set no."], 10) || (setno ? parseInt(setno, 10) : 0) : (setno ? parseInt(setno, 10) : 0);
player.basePrice = playerData["base price"] ? parseInt(playerData["base price"], 10) || 50000 : 50000;
player.bidplace = playerData["s.no"] ? parseInt(playerData["s.no"], 10) : undefined;
player.setname = playerData.setname?playerData.setname.toString():(`set${player.set || (setname ? setname.toString() : "unknown")}`);
player.role = playerData.specialism ? playerData.specialism.toLowerCase() : "unknown";
player.strikeRate = playerData["strike rate"] ? playerData["strike rate"].toString() : "N/A";
player.nationality = playerData.country ? playerData.country.toString() : "unknown";
player.name = playerData["first name"] && playerData.surname ? (`${playerData["first name"]} ${playerData.surname}`).toUpperCase() :(playerData["first name"]).toUpperCase();
player.average = playerData.avg ? playerData.avg.toString() : "N/A";
console.log("ipl"+playerData.ipl)
player.ipl=playerData.ipl?playerData.ipl.toString():"N/A";
player.economy = playerData.economy ? playerData.economy.toString() : "N/A";

// console.log("Single player data and row number:", player, rowNumber);

        players.push(player);
      });
    });

    console.log(`Total players parsed: ${players.length}`);

    if (players.length > 0) {
      try {
        const result = await Player.insertMany(players, { ordered: false });
        console.log(`${result.length} players inserted into the database.`);
      } catch (dbError) {
        console.error("Error inserting players:", dbError);
        return res.status(500).json({ message: "Database insertion error", error: dbError.message });
      }
    }

    res.status(200).json({
      message: "Data processed successfully and inserted into the database",
      insertedPlayers: players.length,
      file: req.file.originalname,
    });
  } catch (error) {
    console.error("Error in addset function:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


const playerinfo = async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments();

    const totalSoldPlayers = await Player.countDocuments({ isSold: true });

    const totalUnsoldPlayers = await Player.countDocuments({ isSold: false, inAuction: true });

    res.status(200).json({
      totalPlayers,
      totalSoldPlayers,
      totalUnsoldPlayers
    });
  } catch (error) {
    console.error('Error fetching player info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getTeaminfo = async (req, res) => {
  try {
    const { id } = req.params; // Extracting team ID from the request parameters

    const team = await Team.findById(id); // Finding the team by ID in the database

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team); // Sending the team data as a response
  } catch (error) {
    console.error("Error fetching team info:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};











module.exports = {deleteplayerfromteam,getplayers,playersToBuy,accelerateplayers,soldPlayers,getTeams,player,createTeam,bid,deleteTeam,deletePlayer,getteamplayers,addset,fetchsets,unsold,playerinfo,getTeaminfo};