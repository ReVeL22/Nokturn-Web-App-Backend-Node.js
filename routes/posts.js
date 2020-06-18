const router = require('express').Router()
const verify = require('./verifyToken')
const Post = require('../model/Post')
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const {
    postValidation
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

//GET ALL POSTS
router.get('/', verifyToken, (req, res) => {
    Post.find()
        .then(posts => {
            res.send(posts);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
})

//GET POST BY USERID
// router.get('/:userid', (req, res) => {
//     Post.findOne({
//         userId: req.params.userid
//     }).then(post => {
//         if (!post) {
//             return res.status(404).send({
//                 message: "Post not found with user id " + req.params.userId
//             })
//         }
//         res.send(post)
//     }).catch(err => {
//         if (err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 message: "Post not found with user id " + req.params.userId
//             })
//         }
//         return res.status(500).send({
//             message: "Error retrieving Post with user id " + req.params.userId
//         })
//     })
// })
//GET POST BY USERID
router.get('/post', verifyToken, function (req, res, next) {
    Post.findOne({
        userId: decodedToken._id
    }).then(post => {
        if (!post) {
            return res.status(200).send({
                message: "Post not found with user id " + decodedToken._id
            })
        }
        res.send(post)
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Post not found with user id " + decodedToken._id
            })
        }
        return res.status(500).send({
            message: "Error retrieving Post with user id " + decodedToken._id
        })
    })
})

//ADD POST
router.post('/', verifyToken, async (req, res) => {

    const {
        error
    } = postValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const post = new Post({
        userId: decodedToken._id,
        name: req.body.name,
        email: req.body.email,
        city: req.body.city,
        instruments: req.body.instruments,
        band: req.body.band,
        about: req.body.about,
        date: req.body.date
    })
    try {
        const savedPost = await post.save()
        res.send({
            post: post._id
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

//UPDATE POST BY USERID
router.put('/', verifyToken, (req, res) => {
    Post.findOneAndUpdate({
            userId: decodedToken._id
        }, {
            name: req.body.name,
            email: req.body.email,
            city: req.body.city,
            instruments: req.body.instruments,
            band: req.body.band,
            about: req.body.about
        }, {
            new: true
        })
        .then(post => {
            if (!post) {
                return res.status(404).send({
                    message: "Post not found with user id " + req.params.userId
                });
            }
            res.send(post);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Post not found with user id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error updating Post with user id " + req.params.userId
            });
        });
});

module.exports = router