const queue = require('../configs/kue');

const commentMailers = require('../mailers/comment_mailer');

queue.process('emails', function(jobs, done){
    console.log('loaded Emails worker: Comment', jobs.data);

    commentMailers.newComment(jobs.data);

    done();
});