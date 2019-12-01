require('dotenv').config()
const { Router } = require('express')
const jwt = require('jsonwebtoken')
const { env: { SECRET } } = process
const bodyParser = require('body-parser')
const jsonBodyParser = bodyParser.json()
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const { createGame, joinGame, retrieveGame, addPlayerHand } = require('../../logic')
const { errors: { ConflictError, NotFoundError, ContentError, CredentialsError, CantAttackError } } = require('baam-util')

const router = Router()

router.post('/create', tokenVerifier, (req, res) => {
    try {
        const { id } = req

        createGame(id)
            .then(({ gameId, playerId }) => {
                const gameToken = jwt.sign({ sub: playerId }, SECRET, { expiresIn: '1d' })
                res.json({ gameId, gameToken })

            })
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

router.get('/:gameId/status', tokenVerifier, (req, res) => {
    try {
        const { playerId, params: { gameId } } = req

        retrieveGame(gameId, playerId)
            .then(game => res.json(game))
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(401).json({ message })
                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/:gameId/join', tokenVerifier, (req, res) => {
    try {
        const { id: userId, params: { gameId } } = req

        joinGame(userId, gameId)
            .then(playerId => {
                const gameToken = jwt.sign({ sub: playerId }, SECRET, { expiresIn: '1d' })
                res.json({ gameToken })
            })
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(400).json({ message })
                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/:gameId/add-hand', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { playerId, body: { hand }, params: { gameId } } = req
        addPlayerHand(gameId, playerId, hand)
            .then(() => res.end())
            .catch((error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError || error instanceof ContentError)
                    return res.status(400).json({ message })
                res.status(500).json({ message })
            }))
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/:gameId/play-card', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { playerId, body: { cardId }, params: { gameId } } = req

        playCard(gameId, playerId, cardId)
            .then(() => res.end())
            .catch(error => {
                const { message } = error
                if (error instanceof CantAttackError || error instanceof CredentialsError)
                    return res.status(403).json({ message })
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError || error instanceof ContentError)
                    return res.status(400).json({ message })
                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

module.exports = router