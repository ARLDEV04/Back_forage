const express = require('express');
const router = express.Router();

//Inporter les controllers
const dataContrller = require('../controllers/dataControllers')

router.post('/', dataContrller.postDebit);
router.get('/', dataContrller.getDatas);
router.get('/test', dataContrller.pingServer);

module.exports = router;