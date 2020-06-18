const router = require('express').Router()
const User = require('../model/User')
const Post = require('../model/Post')
const bcrypt = require('bcryptjs')
const verify1 = require('./verifyToken')
const jwt = require('jsonwebtoken')
const {
    registerValidation,
    loginValidation
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

//GET USER BY ID
router.get('/details', verifyToken, (req, res) => {
    User.findById(decodedToken._id).then(user => {
        if (!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            })
        }
        res.send(user)
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            })
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        })
    })
})

router.get('/username', verifyToken, function (req, res, next) {
    User.findById(decodedToken._id).then(user => {
        if (!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            })
        }
        return res.status(200).json(user.login)
    })
})

//REGISTER
router.post('/register', async (req, res) => {

    const {
        error
    } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //Checking if the user is already in the database
    const emailExist = await User.findOne({
        email: req.body.email
    })
    if (emailExist) return res.status(400).send('Podany adres email znajduje się już w bazie.')

    //Hash passwords
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        lastName: req.body.lastName,
        login: req.body.login,
        email: req.body.email,
        password: hashedPassword,
        city: req.body.city
    })

    try {
        const savedUser = await user.save()
        res.send({
            user: user._id
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    const {
        error
    } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({
        login: req.body.login
    })
    if (!user) return res.status(400).send('Nieprawidłowy login!')

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Nieprawidłowe hasło!')

    const token = jwt.sign({
        _id: user._id
    }, process.env.TOKEN_SECRET, {
        expiresIn: '3h'
    })
    return res.status(200).json(token)
})

//GET ALL USERS
router.get('/', verifyToken, (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
})

//UPDATE USER BY ID
router.put('/details', verifyToken, async (req, res) => {

    const user = await User.findOne({
        _id: decodedToken._id
    })
    if (!user) return res.status(400).send('Nieprawidłowy token!')

    const validPass = (req.body.password == user.password)

    let pass

    if (!validPass) {
        const salt = await bcrypt.genSalt(10)
        pass = await bcrypt.hash(req.body.password, salt)
    } else {
        pass = req.body.password
    }

    User.findByIdAndUpdate(decodedToken._id, {
            password: pass,
            email: req.body.email,
            city: req.body.city
        }, {
            new: true
        })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error updating User with id " + req.params.userId
            });
        });
});

//DELETE USER BY ID
router.delete('/delete', (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send({
                message: "User deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.userId
            });
        });
})

module.exports = router