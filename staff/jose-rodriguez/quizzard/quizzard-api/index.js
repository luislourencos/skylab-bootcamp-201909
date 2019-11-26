require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const { name, version } = require('./package.json')
const { registerUser, authenticateUser, retrieveUser, createQuiz, listQuizs } = require('./logic')
const jwt = require('jsonwebtoken')
const { argv: [, , port], env: { SECRET, PORT = port || 8080, DB_URL } } = process
const tokenVerifier = require('./helpers/token-verifier')(SECRET)
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('quizzard-util')
const { database } = require('quizzard-data')

const api = express()

const jsonBodyParser = bodyParser.json()


api.post('/users', jsonBodyParser, (req, res) => {
    const { body: { name, surname, email, username, password } } = req

    try {
        registerUser(name, surname, email, username, password)
            .then(() => res.status(201).end())
            .catch(error => {

                const { message } = error

                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })

    } catch ({ message }) {
        res.status(400).json({ message })
    }

})

api.post('/auth', jsonBodyParser, (req, res) => {
    const { body: { username, password } } = req

    try {
        authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, SECRET, { expiresIn: '3h' })

                res.json({ token })
            })
            .catch(error => {
                const { message } = error

                if (error instanceof CredentialsError)
                    return res.status(401).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })

    }
})

api.get('/users', tokenVerifier, (req, res) => {
    try {
        const { id } = req
        retrieveUser(id)
            .then(user => res.json({ user }))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })

    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

api.post('/create', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, body: { title, questions } } = req
        debugger
        createQuiz(id, title, questions)
            .then(id => res.status(201).json({ id }))
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })

    }
})

api.post('/game', jsonBodyParser, tokenVerifier, (req,res) => {
    try {
        const { id, body: { quizId } } = req
        createGame(id, quizId)
            .then(pincode => res.status(201).json({pincode}))
            .catch(error => {
                const {message} = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                    
                res.status(500).json({ message })
            })
    } catch ({message}) {
        res.status(400).json({message})
    }
})

api.get('/quizs', tokenVerifier, (req, res) => {
    try {
        const { id } = req
        listQuizs(id)
            .then(quizs => res.send(quizs))
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                return res.status(500).json({ message })
            })

    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

api.patch('/quizs/:quizId', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, params: { quizId }, body: { title, questions } } = req

        modifyQuiz(id, quizId, title, questions)
            .then(() => res.end())
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

api.delete('/tasks/:taskId', tokenVerifier, (req, res) => {
    try {
        const { id, params: { taskId } } = req

        removeTask(id, taskId)
            .then(() => res.end())
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

database
    .connect(DB_URL)
    api.listen(PORT, () => console.log(`${name} ${version} up and running on port ${PORT}`))

