module.exports.recient = function(req, res) {


    // return res.end('<h1>Recient Posts Sections</h1>')
    return res.render('Home', {
        title: "Recient Post Page"
    })
}

module.exports.feed = function(req, res) {


    return res.render('feed', {
        title: "My Feed"
    })
}