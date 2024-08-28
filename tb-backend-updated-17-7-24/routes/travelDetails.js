const express = require('express');
const router = express.Router();
const { submitDetails, sendTravelRequest } = require('../controllers/travelController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/submitDetails', authMiddleware, submitDetails);
router.post('/sendTravelRequest', authMiddleware, sendTravelRequest);

module.exports = router;
