var express = require('express');
var router = express.Router();

/* GET game page */
router.get('/', function(req, res, next) {
    res.render('game', { title: 'TTT' });
});

module.exports = router;
