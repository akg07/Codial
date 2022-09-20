const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie: 'blamsomething',
    db: 'codial_dev',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'ayush3032@gmail.com',
            pass: 'lnccohjdqlcvhufu'
        }
    },
    google_client_id: '462221426572-6f6qn0ekn544f41oal08fgf792uome8i.apps.googleusercontent.com',
    google_client_secret: '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',
    google_callback_url: 'http://localhost:8000/users/auth/google/callback',
    jwt_secert: 'codial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    },
}

const production = {
    name: 'production',
    asset_path: process.env.CODIAL_ASSET_PATH,
    session_cookie: process.env.CODIAL_SESSION_COOKIE,
    db: process.env.CODIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODIAL_GMAIL_USERNAME,
            pass: process.env.CODIAL_USER_PASS
        }
    },
    google_client_id: process.env.CODIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODIAL_GOOGLE_CLIENT_SECERT,
    google_callback_url: process.env.CODIAL_GOOGLE_CALLBACK_URL,
    jwt_secert: process.env.CODIAL_JWT_SECERT,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    },
}

module.exports = development;
// module.exports = eval(process.env.CODIAL_ENV) == undefined ? development : eval(process.env.CODIAL_ENV);