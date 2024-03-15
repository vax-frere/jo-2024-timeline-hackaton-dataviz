import React from 'react'
import Event from './Event'

function assignLevels(events, scale) {
  const scaledEvents = events
    .map((event) => ({
      ...event,
      start: scale(new Date(event.debut)),
      end: scale(new Date(event.fin))
    }))
    .sort((a, b) => a.start - b.start)

  const levels = []
  const levelEnds = []

  scaledEvents.forEach((event) => {
    // Trouver le premier niveau disponible où l'événement peut être placé sans chevauchement
    const levelIndex = levelEnds.findIndex((end) => end <= event.start)
    if (levelIndex >= 0) {
      // Placer l'événement dans le niveau trouvé et mettre à jour la fin de ce niveau
      levels[levelIndex].push(event)
      levelEnds[levelIndex] = event.end
    } else {
      // Aucun niveau disponible trouvé, créer un nouveau niveau pour cet événement
      levels.push([event])
      levelEnds.push(event.end)
    }
  })

  // Attribuer un niveau à chaque événement pour le rendu
  const assignedEvents = levels.flat().map((event, index) => ({
    ...event,
    level: levels.findIndex((level) => level.includes(event))
  }))

  return assignedEvents
}
export default assignLevels
