const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true })

const { Schema } = mongoose
const { ObjectId } = mongoose.Types;

ObjectId.prototype.valueOf = function () {
    return this.toString()
}

const User = mongoose.model('User', new Schema({
    username: String,
    password: String,
}))

const Transaction = mongoose.model('Transaction', new Schema({
    user: { type: ObjectId, ref: 'User' },
    amount: Number,
    type: String, // income, expense
    remark: String,
    date: Date,
    // balance: Number,
}))

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('hello'))

app.get('/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then((data) => {
            res.send(data)
        })
})

app.post('/users/login', (req, res) => {
    User.findOne(req.body).lean()
        .then((data) => {
            if (data) {
                res.send({ ...data, auth: true })
            } else {
                res.status(404).send({ auth: false })
            }
        })
})

app.post('/users', async (req, res) => {
    const idUser = await User.findOne({ username: req.body.username });
    if (idUser) {
        return res.status(400).send({ auth: false, type: 'Username or password is incorrect' });
    } else {
        const salt = await bcrypt.genSalt(10);
        const user = await req.body
        user.password = await bcrypt.hash(user.password, salt);
        await User.create(user)
            .then((data) => {
                res.send(data)
            })
    }
})

app.post('/auth', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const { password, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'));
        res.send({ ...userWithoutHash, token })
    } else {
        return res.status(400)
            .send({
                auth: false,
                type: 'Username or password is incorrect'
            });
    }
})

app.get('/transactions', (req, res) => {
    Transaction.find({ user: req.query.user })
        .then((data) => {
            res.send(data)
        })
})

app.post('/transactions', (req, res) => {
    Transaction.create(req.body)
        .then((data) => {
            res.send(data)
        })
})

app.put('/transactions/:id', (req, res) => {
    Transaction.findOneAndUpdate({ _id: req.params.id }, req.body)
        .then((data) => {
            res.send(data)
        })
})

app.delete('/transactions/:id', (req, res) => {
    Transaction.findOneAndRemove({ _id: req.params.id })
        .then((data) => {
            res.send(data)
        })
})

app.listen(8080, () => {
    console.log('listen on port 8080')
})
