const nodeMailer = require('../configs/nodemailer');

exports.resetPassword = (userWithAT) => {
    let htmlResetPassword = nodeMailer.renderTemplate({
        userWithAT: userWithAT
    }, '/reset_password/reset_pass.ejs');

    nodeMailer.transporter.sendMail({
        from: 'ayush3032@gmail.com',
        to: userWithAT.user.email,
        subject: 'Change user password',
        html: htmlResetPassword
    }, (err, info) => {
        if(err) {
            console.log('Reset Password: err at sending mail ', err); 
            return;
        }

        console.log('Reset Link Sent');
        return;
    });
}