const router=require('express').Router()
const apiController=require('../controllers/apiController')
const authenticateAdmin = require('../middleware/auth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.get('/getplayers',apiController.getplayers);
router.get('/playersToBuy',apiController.playersToBuy);
router.get('/soldPlayers',apiController.soldPlayers);
router.get('/getTeams',apiController.getTeams);
router.get('/getteamplayers/:id',apiController.getteamplayers);
router.get('/getsets',apiController.fetchsets);
router.get('/playerinfo',apiController.playerinfo);
router.get('/accelerateplayers',apiController.accelerateplayers)
router.get('/getTeaminfo/:id',apiController.getTeaminfo)
//router.post("/createplayer",apiController.player);
router.post("/createTeam",authenticateAdmin,apiController.createTeam);
router.post('/bid',authenticateAdmin,apiController.bid);
router.delete('/deleteTeam',authenticateAdmin,apiController.deleteTeam);
router.delete('/deletePlayer',authenticateAdmin,apiController.deletePlayer);
router.post('/createplayer',authenticateAdmin,upload.single('image'), apiController.player);
router.post("/addset", authenticateAdmin, upload.single('excel'),apiController.addset);
router.post("/unsold",authenticateAdmin,apiController.unsold);
router.post("/deleteplayerfromteam",authenticateAdmin,apiController.deleteplayerfromteam)
module.exports = router;
