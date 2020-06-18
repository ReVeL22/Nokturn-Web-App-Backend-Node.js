const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
//Import Routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const tourRoute = require('./routes/tours')
const bandRoute = require('./routes/bands')
const inviteRoute = require('./routes/invites')
var cors = require('cors')
dotenv.config()

app.use(cors())

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

//Middlewar
app.use(express.json())

//Route Middlewares
app.use('/api/users', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/tours', tourRoute)
app.use('/api/bands', bandRoute)
app.use('/api/invites', inviteRoute)

app.listen(3000, () => console.log('Server Up and running'))