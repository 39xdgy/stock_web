const userRoutes = require('./user');

const method = (app) => {
    app.use('api/user/', userRoutes);

    app.use('*', (req, res) => {
        res.json({Error: "404"})
    })
}

module.exports = method