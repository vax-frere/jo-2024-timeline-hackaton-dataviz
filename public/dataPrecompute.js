import * as d3 from 'd3'
import database from './data.json'
// Préparation des données
export let data = database

// data = data.slice(0, 300)

data.sort((a, b) => new Date(a.debut) - new Date(b.debut))
data.forEach((el) => {
  el.duree = (new Date(el.fin) - new Date(el.debut)) / 1000 / 60 / 60
})

// data = data.filter((entry) => {
//   // Vérifie si l'enjeu ne contient pas "Cérémonie" et que l'épreuve ne contient pas "éliminatoire"
//   return !entry.epreuve.includes('éliminatoire')
// })

function calculerDatesCeremonies(events) {
  // Initialiser les objets pour stocker les dates
  const dates = {
    Olympiques: {
      ouverture: null,
      fermeture: null
    },
    Paralympiques: {
      ouverture: null,
      fermeture: null
    }
  }

  // Filtrer et trouver les dates des cérémonies d'ouverture et de fermeture
  events.forEach((event) => {
    if (event.enjeu === 'Cérémonie') {
      if (event.epreuve.includes('ouverture')) {
        if (event.jeux.includes('Olympiques')) {
          dates.Olympiques.ouverture = new Date(event.debut)
        } else if (event.jeux.includes('Paralympiques')) {
          dates.Paralympiques.ouverture = new Date(event.debut)
        }
      } else if (event.epreuve.includes('fermeture')) {
        if (event.jeux.includes('Olympiques')) {
          dates.Olympiques.fermeture = new Date(event.fin)
        } else if (event.jeux.includes('Paralympiques')) {
          dates.Paralympiques.fermeture = new Date(event.fin)
        }
      }
    }
  })

  return dates
}

// Utiliser la fonction pour calculer les dates
const datesCeremonies = calculerDatesCeremonies(data)

// Définir les dates de début et de fin des cérémonies pour chaque type de jeux
export const datesOlympiques = {
  ouverture: new Date('2024-07-26T20:00:00Z'),
  fermeture: new Date('2024-08-13T00:00:00Z')
}
export const datesParalympiques = {
  ouverture: new Date('2024-08-24T20:00:00Z'),
  fermeture: new Date('2024-09-08T23:00:00Z')
}
// const datesOlympiques = datesCeremonies.Olympiques
// const datesParalympiques = datesCeremonies.Paralympiques
// console.log(datesOlympiques, datesParalympiques)
// Filtrer les événements pour chaque type de jeux
const filtrerEvenements = (events, { ouverture, fermeture }) => {
  return events.filter((event) => {
    const debutEvent = new Date(event.debut)
    const finEvent = new Date(event.fin)
    return debutEvent >= ouverture && finEvent <= fermeture
  })
}

const evenementsOlympiques = filtrerEvenements(data, datesOlympiques)
const evenementsParalympiques = filtrerEvenements(data, datesParalympiques)

export { evenementsOlympiques, evenementsParalympiques }

// data = evenementsOlympiques
data = [...evenementsParalympiques, ...evenementsOlympiques]

// Array distinct disciplines triées par ordre alphabétique
const disciplines = d3.groupSort(
  data,
  (d) => d.discipline,
  (d) => d.discipline
)
// console.log('disciplines', disciplines)
export { disciplines }

// Filtrer les événements pour garder uniquement ceux avec une fin valide
const eventsValides = data.filter((evenement) => {
  const debut = new Date(evenement.debut)
  const fin = new Date(evenement.fin)
  return fin >= debut
})

// Tri des événements valides par date de début
eventsValides.sort((a, b) => new Date(a.debut) - new Date(b.debut))

// Calcul de la durée pour chaque événement valide
eventsValides.forEach((el) => {
  el.duree = (new Date(el.fin) - new Date(el.debut)) / 1000 / 60 / 60
})
data = eventsValides

// console.log('data', data)

// Fonction pour regrouper les événements par des plages temporelles identiques et hériter des propriétés du premier événement
function regrouperEtHeriterEvenements(evenements) {
  const groupes = d3.groups(evenements, (d) => d.debut + d.fin)

  return groupes.map((groupe) => {
    // Cloner le premier événement pour en faire l'événement principal du groupe
    const evenementPrincipal = { ...groupe[1][0] }

    // Ajouter une propriété pour la liste des événements qui partagent cette plage temporelle
    evenementPrincipal.evenements = groupe[1]

    return evenementPrincipal
  })
}

// Utiliser la fonction pour regrouper les événements et hériter des propriétés
const evenementsGroupesEtHerites = regrouperEtHeriterEvenements(data)

// console.log(evenementsGroupesEtHerites)

data = evenementsGroupesEtHerites

export default data

{
  /* {
      "jeux": "Olympiques",
      "discipline": "Cérémonie",
      "epreuve": "Cérémonie d'ouverture",
      "phase": "",
      "genre": "Mixte",
      "debut": "2024-07-26T20:00:00Z",
      "fin": "2024-07-26T23:15:00Z",
      "lieu": "Quais de Seine",
      "session": "OOC01",
      "latitude": 48.8634,
      "longitude": 2.3049,
      "ville": "Paris (75)",
      "capacite": 326000,
      "enjeu": "Cérémonie"
    }, */
}
