const jwt = require('jsonwebtoken')

var decodedToken
module.exports = function (req, res, next) {
    const token = req.query.token
    if (!token)

        jwt.verify(token, process.env.TOKEN_SECRET, function (err, tokendata) {
            if (err) {
                return res.status(400).json('Odmowa dostępu!')
            }
            if (tokendata) {
                decodedToken = tokendata
                next()
            }
        })
}

module.exports.decodedToken = decodedToken