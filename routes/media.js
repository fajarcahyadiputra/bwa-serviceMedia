const express = require('express');
const router = express.Router();
const MediaController = require('../controllers/MediaController');

router.get('/', MediaController.getData);
router.post('/', MediaController.addData);
router.delete('/:id', MediaController.deleteData);

module.exports = router;
