import { Line, Text, Plane } from '@react-three/drei'
import * as d3 from 'd3'
import config from '../config.js'

const zPos = -0.2

const Ticks = ({ startDate, endDate, scale, size, maxLevel }) => {
  const dayTicks = d3.timeDay.range(startDate, endDate, 1)
  const hourTicks = d3.timeHour.range(startDate, endDate, 2) // Génère des tics toutes les 4 heures
  const formatDay = d3.timeFormat('%d %B')
  const formatDayAlone = d3.timeFormat('%d')
  const formatHour = d3.timeFormat('%H h')
  // Positions X pour le début et la fin
  const startX = scale(startDate)
  const endX = scale(endDate)

  const generateIntermediateLines = (maxLevel, spacing = 3, offset = 0.2) => {
    const lines = []
    for (let y = 0; y < maxLevel - 1; ) {
      y += offset

      let startPoint = [0, y, zPos]
      let endPoint = [size + 0, y, zPos]
      lines.push([startPoint, endPoint])

      y += spacing
      // Adjust the starting point (x) as necessary
      startPoint = [0, y, zPos]
      endPoint = [size + 0, y, zPos]
      lines.push([startPoint, endPoint])
    }
    return lines
  }

  const intermediateLines = generateIntermediateLines(maxLevel)
  const generateIntermediatePlanes = (maxLevel, spacing = 3, offset = 0.2) => {
    const planes = []
    let i = 0
    for (let y = offset; y < maxLevel; y += spacing + offset) {
      const height = spacing // La hauteur d'un niveau est de 3
      const planeY = y + height / 2 // Centre le plane verticalement dans le niveau
      i++
      if (i % 2 === 0) {
        planes.push(
          <Plane
            key={`plane-${y}`}
            args={[size, height, 1, 1]} // Taille du plane en fonction de la longueur de la timeline et de la hauteur d'un niveau
            position={[size / 2, planeY, zPos]} // Positionne le plane au centre de la timeline et au niveau y
            rotation={[0, 0, 0]}>
            <meshBasicMaterial attach="material" color="lightgrey" transparent opacity={0.23} />
          </Plane>
        )
      }
    }
    return planes
  }

  // Puis dans le composant de rendu, vous pouvez appeler cette fonction pour obtenir les planes intermédiaires :
  const intermediatePlanes = generateIntermediatePlanes(maxLevel)

  // Fonction pour générer et afficher des rectangles pour chaque plage horaire nocturne
  const generateNightRectangles = () => {
    const nightRectangles = []
    let current = new Date(startDate)

    while (current < endDate) {
      const nightStart = new Date(current)
      nightStart.setHours(config.nightLateTime, 0, 0, 0) // Début de la nuit à 20h

      let nightEnd = new Date(nightStart)
      nightEnd.setDate(nightEnd.getDate() + 1)
      nightEnd.setHours(config.nightEarlyTime, 0, 0, 0) // Fin de la nuit à 6h du matin suivant

      // Assurer que la plage de nuit ne dépasse pas la endDate
      if (nightEnd > endDate) {
        nightEnd = endDate
      }

      if (nightStart <= endDate) {
        const xStart = scale(nightStart)
        const xEnd = scale(nightEnd)
        const width = xEnd - xStart
        if (width > 0) {
          // Ajout du rectangle pour la plage nocturne
          nightRectangles.push(
            <Plane
              key={`night-${nightStart.toISOString()}`}
              args={[width, maxLevel, 1, 1]}
              position={[(xStart + xEnd) / 2, maxLevel / 2, zPos]}
              rotation={[0, 0, 0]}>
              <meshBasicMaterial attach="material" color={config.nightColor} transparent opacity={0.1} />
            </Plane>
          )
        }
      }

      // Préparer la date de début suivante
      current = d3.timeDay.offset(current, 1)
    }

    return nightRectangles
  }

  return (
    <>
      <Text
        position={[0, maxLevel + 2.3, 0]} // Ajustez cette position selon vos besoins
        color={config.hourLabelColor}
        fontWeight={'black'}
        anchorX="center"
        anchorY="top"
        fontSize={config.hourLabelSize} // Ajustez la taille de police au besoin
      >
        Début
      </Text>
      <Text
        position={[endX, maxLevel + 2.5, 0]} // Ajustez cette position selon vos besoins
        color={config.hourLabelColor}
        fontWeight={'black'}
        anchorX="center"
        anchorY="top"
        fontSize={config.hourLabelSize} // Ajustez la taille de police au besoin
      >
        Fin
      </Text>
      <Line
        points={[
          [0, 0, zPos],
          [0, maxLevel, zPos] // Ajustez screenHeight en fonction de la hauteur de votre visualisation
        ]}
        color={config.dayLineColor} // Couleur en gris léger
        lineWidth={config.dayLineWidth} // 3px d'épaisseur
      />
      <Line
        points={[
          [endX, 0, zPos],
          [endX, maxLevel, zPos] // Ajustez screenHeight en fonction de la hauteur de votre visualisation
        ]}
        color={config.dayLineColor} // Couleur en gris léger
        lineWidth={config.dayLineWidth} // 3px d'épaisseur
      />
      {dayTicks.map((tick, index) => {
        const x = scale(tick)
        return (
          <group key={`day-${index}`}>
            <Line
              points={[
                [x, 0, zPos],
                [x, maxLevel, zPos] // Ajustez screenHeight en fonction de la hauteur de votre visualisation
              ]}
              color={config.dayLineColor} // Couleur en gris léger
              lineWidth={config.dayLineWidth} // 3px d'épaisseur
            />
            <Text
              position={[x, maxLevel + 2.2, zPos]} // Ajustez cette position selon vos besoins
              color={config.hourLabelColor}
              fontWeight={'black'}
              anchorX="center"
              anchorY="top"
              fontSize={config.hourLabelSize} // Ajustez la taille de police au besoin
            >
              {formatDayAlone(tick)}
            </Text>
          </group>
        )
      })}
      {generateNightRectangles()}
      {}
      {intermediateLines.map((points, index) => (
        <group key={`intermediate-line-${index}`}>
          <Line
            points={points}
            position={[0, 0, zPos]}
            color={config.intermediateLineColor}
            lineWidth={config.intermediateLineWeight}
            transparent
            opacity={1}
          />
        </group>
      ))}
      {intermediatePlanes}

      {hourTicks.map((tick, index) => {
        const x = scale(tick)
        return (
          <group key={`hour-${index}`}>
            <Line
              points={[
                [x, -0, zPos],
                [x, maxLevel, zPos] // Utilisez la même logique pour ajuster la hauteur
              ]}
              color={config.hourLineColor} // Un gris encore plus léger
              lineWidth={config.hourLineWidth} // Ligne plus fine
              dashed={true} // Rend la ligne pointillée
              dashScale={2} // 2 fois plus long
              dashArray={[10, 10]}
            />
            <Text
              position={[x, -1, zPos]} // Ajustez cette position selon vos besoins
              color={config.hourLabelColor}
              fontWeight={'black'}
              anchorX="center"
              anchorY="top"
              fontSize={config.hourLabelSize} // Ajustez la taille de police au besoin
            >
              {formatHour(tick)}
            </Text>
          </group>
        )
      })}
    </>
  )
}

export default Ticks
