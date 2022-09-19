

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
}

module.exports = development;