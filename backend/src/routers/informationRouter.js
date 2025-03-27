const express = require('express');
const router = express.Router();
const informationController = require('../controllers/informationController');

router.get('/', informationController.getAllInformation);

router.post('/create', informationController.createInformation);

router.delete('/:id', informationController.deleteInformationById);

router.put('/:id', informationController.updateInformationById);

module.exports = router;