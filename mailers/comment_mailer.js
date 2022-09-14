const nodeMailer = require('../configs/nodemailer');

// this is another way of exporting a method
exports.newComment = (comment) => {
    // console.log('inside new comment mailer', comment);
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'ayush3032@gmail.com',
        to: comment.user.email,
        subject: 'you commented on post',
        html: htmlString
    }, (err, info) => {
        if(err) {console.log('err in sending mail', err); return;}

        console.log('Message sent', info);

        return;
    });
}