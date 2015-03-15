function getQuery()
{
    var qString = window.location.search.slice(1);
    var qStrings = qString.split('&');
    var rval = {};

    for (var i = 0; i < qStrings.length; i++) {
        var keyVal = qStrings[i].split('=');
        rval[keyVal[0]] = keyVal[1];
    }

    return rval;
}
