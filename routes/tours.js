const router = require('express').Router()
const verify = require('./verifyToken')
const Tour = require('../model/Tour')
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const {
    tourValidation
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

//GET TOURS BY USERID
router.get('/get', verifyToken, function (req, res, next) {
    Tour.find({
        userId: decodedToken._id
    }).then(tours => {
        if (!tours) {
            return res.status(200).send({
                message: "Tours not found with user id " + decodedToken._id
            })
        }
        res.send(tours)
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Tours not found with user id " + decodedToken._id
            })
        }
        return res.status(500).send({
            message: "Error retrieving Tours with user id " + decodedToken._id
        })
    })
})

//ADD TOUR
router.post('/add', verifyToken, async (req, res) => {

    const {
        error
    } = tourValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const tour = new Tour({
        userId: decodedToken._id,
        city: req.body.city,
        eventDate: req.body.eventDate,
        date: req.body.date
    })
    try {
        const savedTour = await tour.save()
        res.send({
            tour: tour._id
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

//DELETE TOUR
router.delete('/delete', verifyToken, async (req, res) => {
    Tour.findByIdAndRemove(req.query.id)
        .then(tour => {
            if (!tour) {
                return res.status(404).send({
                    message: "Tour not found with id " + req.params.userId
                });
            }
            res.send({
                message: "Tour deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Tour not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Tour not delete user with id " + req.params.userId
            });
        });
})

module.exports = router