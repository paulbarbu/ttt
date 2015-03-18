var express = require('express');
var router = express.Router();

var title = 'TTT | Login';

/* GET login page */
router.get('/', function(req, res, next) {
    res.render('login', { title: title });
});

/**
 * POST login page
 * Login button has been pressed
 */
router.post('/', function(req, res, next) {
    // TODO: check unique name, go to /start
    if(req.body.nick)
    {
        res.redirect('/start');
    }
    else
    {
        //TODO: display errors regarding the nickname
        res.render('login', { title: title });
    }
});

module.exports = router;
