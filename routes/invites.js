const router = require('express').Router()
const verify = require('./verifyToken')
const Invite = require('../model/Invite')
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const {
    inviteValidation
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

//GET ALL INVITES
router.get('/', verifyToken, (req, res) => {
    Invite.find()
        .then(invite => {
            res.send(invite);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
})

//GET INVITES BY USERID
router.get('/get', verifyToken, function (req, res, next) {
    Invite.find({
        endUserId: decodedToken._id
    }).then(invites => {
        if (!invites) {
            return res.status(200).send({
                message: "Invites not found with user id " + decodedToken._id
            })
        }
        res.send(invites)
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Invites not found with user id " + decodedToken._id
            })
        }
        return res.status(500).send({
            message: "Error retrieving Invites with user id " + decodedToken._id
        })
    })
})

// ADD INVITE
router.post('/add', verifyToken, async (req, res) => {

    const {
        error
    } = inviteValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const invite = new Invite({
        userId: decodedToken._id,
        endUserId: req.body.endUserId,
        name: req.body.name
    })
    try {
        const savedInvite = await invite.save()
        res.send({
            invite: invite._id
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

// DELETE INVITE
router.delete('/delete', verifyToken, async (req, res) => {
    Invite.findOneAndDelete({
            userId: req.query.userId,
            endUserId: decodedToken._id
        })
        .then(invite => {
            if (!invite) {
                return res.status(404).send({
                    message: "Invite not found with id " + req.params.userId
                });
            }
            res.send({
                message: "Invite deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Invite not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Could not delete invite with id " + req.params.userId
            });
        });
})

module.exports = router