import React, { useState, useEffect } from 'react'
import './index.sass'
import { withRouter } from 'react-router-dom'
import { listUsers, retrieveOtherUser, listPractices, createPractice } from '../../logic'
import OptionsInstructors from './options-instructors.js'
import OptionsDate from './options-date.js'
import OptionsTime from './options-time.js'
import Feedback from '../Feedback'

const moment = require('moment')

export default withRouter(function({ history }) {
  const [instructors, setInstructors] = useState()
  const [calendar, setCalendar] = useState()
  const [indexDay, setIndexDay] = useState()
  const [notification, setNotification] = useState(null)

  const { token } = sessionStorage

  useEffect(() => {
    (async () => {
      try {
        // recoge todos los profesores
        let result = await listUsers(token)
        const { users } = result
        setInstructors(users)
      } catch ({ message }) {
        setNotification({ error: true, message })
      }
    })()
  }, [])


  const generateAvailableCalendar = async (event) => {
    // prepare empty calendar
  /*  setNotification(null)*/
    setCalendar([])
    setIndexDay(undefined)

    let id = event.target.value
    let schedule = await getAvailableSchedule(id)
    let calendar = generateCalendar(schedule)
    let reservations = await retrieveReservations(id)
    let availableCalendar = getAvailableCalendar(calendar, reservations)
    setCalendar(availableCalendar)
  }


  // retrieve choosed instructor schedule
  const getAvailableSchedule = async (id) => {
    try {
      let result = await retrieveOtherUser(token, id)
      const { user: { profile: { schedule: { days }}} } = result
      return days
    } catch ({ message }) {
      setNotification({ error: true, message })
    }
  }


  // genera un calendario con días y horas reales a partir del schedule
  const generateCalendar = (schedule) => {
    let calendar = []
    // transform schedule in a object with real dates and array of times
    for (let i = 0; i < 30; i++) {
      const weekday = moment().add(i, 'day').day()
      const today = Number(moment().day())

      if ( schedule && schedule[weekday].hours.length > 0) {
        let day = moment().day(i + today, 'day').format('DD-MM-YYYY')
        const hours = schedule[weekday].hours
        calendar.push({ day, hours })
      }
    }
    calendar = checkPastTime(calendar)
    return calendar
  }


  // checks if the first day of the array is today. If is today, removes from the array of hours, the hours that are past (to no offer a new practice in the past)
  const checkPastTime = (calendar) => {

    if (calendar.length && calendar[0].day === moment().format('DD-MM-YYYY')) {
      let timeNow = moment().format('HH:mm')
      timeNow = moment(timeNow, 'HH:mm') //parse string to moment hour
      let timePending = []

      calendar[0].hours.forEach(hour => {
        const timeAvailable = moment(hour, "HH:mm") //parse string to moment hour

        if (timeNow < timeAvailable) {
          timePending.push(moment(timeAvailable).format('HH:mm'))
        }
      })
      // update today hours
      calendar[0].hours = timePending
    }
    return calendar
  }


// recoge las reservas pendientes del profesor
  const retrieveReservations = async (id) => {
    let reservations = []
    try {
      let result = await listPractices(token, id)
      const { practices } = result
      if(practices) {
        let pendingPractices = practices.filter(pract => pract.status === 'pending')
        pendingPractices && pendingPractices.forEach(practice => {
          const [day, hour] = moment(practice.date).format('DD-MM-YYYY HH:mm').split(' ')
          reservations.push({ day, hour })
        })
      }
      return reservations
    } catch ({ message }) {
      setNotification({ error: true, message })
    }
  }


 // genera el calendario disponible, restando las reservas pendientes y eliminando los días que no tienen horas disponibles
  const getAvailableCalendar = (calendar, reservations) => {
    reservations && reservations.forEach(reservation =>
      calendar.forEach(date => {
        if(reservation.day === date.day) {
          let index = date.hours.indexOf(reservation.hour)
          index >= 0 && date.hours.splice(index, 1)
        }
    }
  ))
  // clean empty days
  let availableCalendar = calendar.filter(day => day.hours.length > 0)
  return availableCalendar
 }

 // el día que ha seleccionado el usuario
  const selectData = (event) => {
    const indexDay = event.target.value
    setIndexDay(indexDay)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    let { instructor: {value: instructorId}, day: { value: indexDay }, hour: { value: hour } } = event.target
    let day = calendar[indexDay].day
    let dateTime = moment(`${day} ${hour}`, "DD-MM-YYYY HH:mm")
    handleReservatePractice(instructorId, dateTime)
  }

  const handleReservatePractice = async (instructorId, dateTime) => {
    try {
      await createPractice(token, instructorId, dateTime)
      setNotification({ error: false, message: 'You have successfully booked!' })
    } catch ({ message }) {
      setNotification({ error: true, message })
    }
  }

  return <>
    <div className='title'>
      <i onClick={() => history.goBack()} className="material-icons">undo</i>
      <h3>Booking</h3>
    </div>
    <section className='booking'>
      <div>
        <h3>Do you want to book a practice?</h3>
        <p>You can select the instructor you prefer and the day and time that suits you best!</p>
        <p>Every practice costs 1 credit.</p>
      </div>
      <form onSubmit={handleSubmit} >
       <select name="instructor" onChange={generateAvailableCalendar} >
          <option value="" >-- instructor --</option>
         { instructors && instructors.map((instructor, i) =>
            <OptionsInstructors name='instructor' key={i} id={instructor._id} instructor={instructor} />)
         }
        </select>
       <select name="day" onChange={selectData} >
          <option value="">-- date --</option>
         { calendar && calendar.map((elem, i) =>
            <OptionsDate name='day' key={i} index={i} day={elem.day} />)
         }
        </select>
       <select name="hour">
          <option value="">-- time --</option>
         { indexDay && calendar[indexDay].hours.map((hour, i) =>
            <OptionsTime name='hour' key={i} hour={hour} />)
         }
        </select>
        <button>Confirm</button>
      </form>
      {notification && <Feedback {...notification} />}
    </section>
  </>
})

