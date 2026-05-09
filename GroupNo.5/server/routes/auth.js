const router  = require('express').Router();
const ctrl    = require('../controllers/authController'); 
const protect = require('../middleware/auth');
const multer  = require('multer');
const path    = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.id}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

router.post('/signup',          ctrl.signup);
router.post('/login',           ctrl.login);
router.get('/profile',  protect, ctrl.getProfile);
router.put('/profile',  protect, ctrl.updateProfile);

router.delete('/profile', protect, ctrl.deleteAccount); 
router.post('/upload-avatar', protect, upload.single('avatar'), ctrl.uploadAvatar);

module.exports = router;
