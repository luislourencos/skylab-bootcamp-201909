import React, { useState, useEffect, useContext } from 'react'
import Context from '../Context'
import './index.sass'
import { retrieveUserCards } from '../../logic'

export default function ({ onLogout, onGetNewCards, user, onHome }) {
    const [cards, setCards] = useState()
    const { feed, setFeed } = useContext(Context)

    useEffect(() => {
        const { token } = sessionStorage;

        (async () => {
            if (token) {
                try {
                    let cards = await retrieveUserCards(token)
                    setCards(cards)
                } catch ({message}) {
                    setFeed({ title: "🦖 There was an error:", message })
                }
            }
        })()
    }, [])

    return <section class="your-cards">
        <div class="upper-menu">
            <div class="upper-menu__container">
                <a class="upper-menu__item" href="#" onClick={event => {
                    event.preventDefault()
                    onGetNewCards()
                }}><div>Get New Cards!</div></a>
            </div>
            {user && <div className="upper-menu__container">
                <div className="upper-menu__item">Hello {user.nickname}</div>
                <a href="#" className="upper-menu__item" onClick={event => { event.preventDefault(); onLogout() }}>Log out</a>
                <a href="#" className="upper-menu__item" onClick={event => { event.preventDefault(); onHome() }}>HOME</a>
            </div>}
        </div>
        <div class="your-cards__title">YOUR CARDS:</div>
        <div class="your-cards__container">
            <div class="your-cards__card-list">
                {cards && cards.map(card =>
                    <div class="your-cards__card-detail">
                        <img class="your-cards__card-front" src={`img/${card.image}`}></img>
                        <div class="your-cards__card-back"> 
                            <p>{`Name: ${card.name}`}</p>
                            <p>{`Description: ${card.description}`}</p>
                            <p>{`Price: ${card.price}`}</p>
                        </div>
                    </div>)}
            </div>
        </div>
    </section>
}