const express = require('express')

const { View, Landing, Register, Login, Search, Detail } = require('./components')
const { bodyParser, cookieParser } = require('./utils/middlewares')
const { registerUser, authenticateUser, retrieveUser, searchDucks, toggleFavDuck, retrieveDuck } = require('./logic')

const { argv: [, , port = 8080] } = process

const sessions = {}

const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send(View({ body: Landing({register: '/register', login: '/login'}) }))
} )


app.get('/register', (req, res) => {
    res.send(View({ body: Register( { path: '/register' }) }))
})

app.post('/register', bodyParser, (req, res) => {
        const { body: {name, surname, email, password} } = req
        try {
            registerUser(name, surname, email, password)
                .then(() => res.redirect('/login'))
                .catch(({message}) => res.send (View({ body: Register( { path: '/register', error: message} )})))
                
        } catch(error) {
            res.send(View({ body: Register({ path: '/register', error: error.message})}))
        }
}) 

app.get('/login', (req, res) => {
    res.send(View({ body: Login({ path: '/login' }) }))
})


app.post('/login', bodyParser, (req, res) => {

        const { body:{ email, password} } = req
        try{
            authenticateUser(email, password)
                .then((credentials) => { 
                    const { id, token } = credentials 

                    sessions[id] = { token }

                    res.setHeader('set-cookie', `id=${id}`)

                    res.redirect('/search')
                })
                .catch(({message}) => res.send (View({ body: Login( { path: '/login', error: message} )})))
        }catch(error){
            res.send(View({ body: Login({ path: '/login', error: error.message})}))
        }
})

app.get('/search', cookieParser, (req, res) => {
    try {
        const { cookies: { id }, query: { q: query } } = req

        if (!id) return res.redirect('/login')

        const session = sessions[id]

        if (!session) return res.redirect('/login')

        const { token } = session

        if (!token) return res.redirect('/login')

        let name

        retrieveUser(id, token)
            .then(user => {
                name = user.name

                if (!query) return res.send(View({ body: Search({ path: '/search', name, logout: '/logout' }) }))

                session.query = query

                return searchDucks(id, token, query)
                .then(ducks => {
                    res.setHeader('set-cookie', `path=/search`)
                    res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', results: ducks, favPath: '/fav', detailPath: '/ducks' }) }))
                    })
            })
            .catch(({ message }) => res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', error: message }) })))
    } catch ({ message }) {
        res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', error: message }) }))
    }
})
   
app.post('/logout', cookieParser, (req, res) => {
    res.setHeader('set-cookie', 'id=""; expires=Thu, 01 Jan 1970 00:00:00 GMT')
    res.setHeader('set-cookie', 'path=""; expires=Thu, 01 Jan 1970 00:00:00 GMT')

    const { cookies: { id } } = req

    if (!id) return res.redirect('/')

    delete sessions[id]

    res.redirect('/')
})

app.post('/fav', cookieParser, bodyParser, (req, res) => {
    try {
        const { cookies: { id, path }, body: { id: duckId } } = req
        
        if (!id) return res.redirect('/')

        const session = sessions[id]

        if (!session) return res.redirect('/')

        const { token, query } = session

        if (!token) return res.redirect('/')

        toggleFavDuck(id, token, duckId)
            .then(() =>{path === '/search' ? res.redirect(`/search?q=${query}`) : res.redirect(`/ducks/${duckId}`)})
            .catch(({ message }) => {
                res.send('TODO error handling1')
            })
    } catch ({ message }) {
        res.send('TODO error handling2')
    }
})

app.get('/ducks/:duckId', cookieParser, bodyParser, (req, res) => {
    try{

        const { params: { duckId } } = req

        const { cookies: {id, path } } = req
               
        if(path) res.clearCookie('path') 
        
        if(!id) return res.redirect('/')

        const session = sessions[id]

        if(!session) return res.redirect('/')

        const { token } = session

        if (!token) return res.redirect('/')

        retrieveDuck(id, token, duckId)
            .then(duck => { 
                res.setHeader('set-cookie', `path=/ducks/${duckId}`)
                res.send(View({ body: Detail( { item: duck, favPath: '/fav', back: '/back' })}))
            })
            .catch(({ error }) => res.send(error))
    

    } catch(error){
        res.send('TODO error handling2')
    }
})

app.post('/back', cookieParser, (req, res) => {
   
    const { cookies: { id } } = req
    
    if (!id) return res.redirect('/')

    const session = sessions[id]

    if (!session) return res.redirect('/')

    const { token, query } = session

    if (!token) return res.redirect('/')

    res.redirect(`/search?q=${query}`)
})

app.listen(port, () => console.log(`server running on port ${port}`))


