const router = require('express').Router()
const verify = require('./verifyToken')
const Band = require('../model/Band')
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const {
    bandValidation
} = require('../validation')

var decodedToken = ''

function verifyToken(req, res, next) {
    let token = req.query.token

    jwt.verify(token, process.env.TOKEN_SECRET, function (err, tokendata) {
        if (err) {
            return res.status(400).json(err)
        }
        if (tokendata) {
            decodedToken = tokendata
            next()
        }
    })
}

//GET THE USER BAND BY USERID
router.get('/get', verifyToken, function (req, res, next) {
    Band.find({
        usersId: decodedToken._id
    }).then(band => {
        if (!band) {
            return res.status(200).send({
                message: "Band not found with user id " + decodedToken._id
            })
        }
        res.send(band)
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Band not found with user id " + decodedToken._id
            })
        }
        return res.status(500).send({
            message: "Error retrieving Band with user id " + decodedToken._id
        })
    })
})

//GET ANOTHER USER BAND BY USERID
router.get('/getBand', verifyToken, function (req, res, next) {
    Band.find({
        usersId: req.query.usersId
    }).then(band => {
        if (!band) {
            return res.status(200).send({
                message: "Band not found with user id " + decodedToken._id
            })
        }
        res.send(band)
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Band not found with user id " + decodedToken._id
            })
        }
        return res.status(500).send({
            message: "Error retrieving Band with user id " + decodedToken._id
        })
    })
})

// //ADD BAND
router.post('/add', verifyToken, async (req, res) => {

    const {
        error
    } = bandValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const band = new Band({
        usersId: decodedToken._id,
        name: req.body.name
    })
    try {
        const savedBand = await band.save()
        res.send({
            tour: band._id
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

// //DELETE BAND
router.delete('/delete', verifyToken, async (req, res) => {
    Band.findOneAndDelete({
            usersId: decodedToken._id
        })
        .then(band => {
            if (!band) {
                return res.status(404).send({
                    message: "Band not found with id " + req.params.userId
                });
            }
            res.send({
                message: "Band deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Band not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Could not delete band with id " + req.params.userId
            });
        });
})

//UPDATE BAND BY USERID
router.put('/', verifyToken, (req, res) => {
    Band.findOneAndUpdate({
            usersId: req.query.userId
        }, {
            name: req.body.name,
            usersId: req.body.usersId
        }, {
            new: true
        })
        .then(band => {
            if (!band) {
                return res.status(404).send({
                    message: "Band not found with user id " + req.query.userId
                });
            }
            res.send(band);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Band not found with user id " + req.query.userId
                });
            }
            return res.status(500).send({
                message: "Error updating Band with user id " + req.query.userId
            });
        });
});

module.exports = router