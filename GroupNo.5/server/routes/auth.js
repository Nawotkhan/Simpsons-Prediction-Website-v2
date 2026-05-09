const router  = require('express').Router();
const ctrl    = require('../controllers/authController'); 
const protect = require('../middleware/auth');

router.post('/signup',          ctrl.signup);
router.post('/login',           ctrl.login);
router.get('/profile',  protect, ctrl.getProfile);
router.put('/profile',  protect, ctrl.updateProfile);

router.delete('/profile', protect, ctrl.deleteAccount); 


module.exports = router;
