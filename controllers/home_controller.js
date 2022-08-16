module.exports.home = function(req, res) {


    return res.end('<h1>Express is up for Codial!!</h1>')
}

module.exports.user = function(req, res) {


    return res.end('<h3>Hello User!! Welcome to the Codial: code for all</h3>');
}

/*
module.exports.actionName = function(req, res) {
    // Put your actions here which you need to perform for this
    // perticular actionName
}

*/