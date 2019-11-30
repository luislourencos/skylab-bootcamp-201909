const { Router } = require('express')
const { createRss } = require('../../logic')
const jwt = require('jsonwebtoken')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { ConflictError } } = require('quickshare-util')

const jsonBodyParser = bodyParser.json()

const router = Router()

router.post('/', jsonBodyParser, (req, res) => {
    const { body: { userId, title, url, description, imageUrl, language } } = req

    try {
        createRss( userId, title, url, description, imageUrl, language )
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

module.exports = router