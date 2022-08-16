module.exports.home = function(req, res) {


    // return res.end('<h1>Express is up for Codial!!</h1>')
    return res.render('home', {
        title: "Home"
    });
}

/*
module.exports.actionName = function(req, res) {
    // Put your actions here which you need to perform for this
    // perticular actionName
}

*/