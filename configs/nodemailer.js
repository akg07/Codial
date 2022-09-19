const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./enviornment');

// this is part which sends email to users
let transporter = nodemailer.createTransport(env.smtp);

// it's define we are going to send an html mail
let renderTemplate = (data, realtivePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailer', realtivePath),
        data,
        function(err, template) {
            if(err) {console.log('err in rendering template', err); return;}

            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}