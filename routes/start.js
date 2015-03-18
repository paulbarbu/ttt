var express = require('express');
var router = express.Router();

var title = 'TTT | Start';

/* GET login page */
router.get('/', function(req, res, next) {
    res.render('start', { title: title });
});


/**
 * POST start page
 * Start button has been pressed
 */
router.post('/', function(req, res, next) {
    if(req.body.start === 'Start a game')
    {
        res.redirect('/');
    }
    else
    {
        res.render('start', { title: title });
    }
});

module.exports = router;
