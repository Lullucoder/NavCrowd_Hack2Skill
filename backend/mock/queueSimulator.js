import { predictWaitTime } from '../services/predictionEngine.js'

const queueState = new Map([
  ['f-01', { id: 'f-01', name: 'Smash Burger Bay', zone: 'Concourse B', type: 'food', peopleWaiting: 24, zoneLoad: 0.64 }],
  ['f-02', { id: 'f-02', name: 'Masala Wrap Point', zone: 'Concourse C', type: 'food', peopleWaiting: 13, zoneLoad: 0.48 }],
  ['m-01', { id: 'm-01', name: 'Official Jersey Store', zone: 'North Atrium', type: 'merch', peopleWaiting: 9, zoneLoad: 0.33 }],
  ['r-01', { id: 'r-01', name: 'Restroom Block D', zone: 'Gate D', type: 'restroom', peopleWaiting: 11, zoneLoad: 0.39 }]
])

const activeTickets = new Map()
let ticketCounter = 400

const toQueuePayload = (stall) => ({
  ...stall,
  predictedWaitMinutes: predictWaitTime({ peopleWaiting: stall.peopleWaiting, zoneLoad: stall.zoneLoad })
})

export const listQueueStatus = () => Array.from(queueState.values()).map(toQueuePayload)

export const joinQueue = ({ stallId, userId = 'guest-user' }) => {
  const stall = queueState.get(stallId)

  if (!stall) {
    throw new Error('Invalid stall id')
  }

  stall.peopleWaiting += 1

  const ticketId = `Q-${ticketCounter += 1}`
  const position = stall.peopleWaiting
  const predictedWaitMinutes = predictWaitTime({ peopleWaiting: position, zoneLoad: stall.zoneLoad })

  const ticket = {
    ticketId,
    userId,
    stallId,
    position,
    predictedWaitMinutes,
    createdAt: new Date().toISOString()
  }

  activeTickets.set(ticketId, ticket)

  return ticket
}

export const leaveQueue = ({ ticketId }) => {
  const ticket = activeTickets.get(ticketId)

  if (!ticket) {
    return { removed: false }
  }

  const stall = queueState.get(ticket.stallId)
  if (stall && stall.peopleWaiting > 0) {
    stall.peopleWaiting -= 1
  }

  activeTickets.delete(ticketId)

  return { removed: true }
}
