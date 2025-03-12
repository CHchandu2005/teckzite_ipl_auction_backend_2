const router=require('express').Router();
const authController=require('../controllers/authController')

router.post('/login',authController.adminlogin);
router.post('/verify',authController.verify);

module.exports = router;