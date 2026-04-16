const parkingZones = [
  { id: 'A', name: 'Parking A', totalSpots: 1200, availableSpots: 182, walkMinutes: 8, gate: 'Gate 1' },
  { id: 'B', name: 'Parking B', totalSpots: 950, availableSpots: 74, walkMinutes: 6, gate: 'Gate 2' },
  { id: 'C', name: 'Parking C', totalSpots: 1300, availableSpots: 462, walkMinutes: 11, gate: 'Gate 3' },
  { id: 'D', name: 'Parking D', totalSpots: 780, availableSpots: 298, walkMinutes: 5, gate: 'Gate 4' }
]

export const listParkingZones = () => parkingZones

export const recommendParkingBySeat = ({ seat = 'B-127' }) => {
  const block = seat.split('-')[0]?.trim().toUpperCase()

  if (block === 'A' || block === 'B') {
    return parkingZones.find((zone) => zone.id === 'B')
  }

  if (block === 'C' || block === 'D') {
    return parkingZones.find((zone) => zone.id === 'C')
  }

  return parkingZones.find((zone) => zone.id === 'A')
}
