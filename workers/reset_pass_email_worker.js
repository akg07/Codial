const queue = require('../configs/kue');

const resetPassMailer = require('../mailers/reset_pass_mailer');

queue.process('resetPassEmails', function(job, done){
    console.log('loaded Emails worker: Reset Password');

    resetPassMailer.resetPassword(job.data);

    done();
});