import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, Line, Html, Text, PerspectiveCamera, Image, OrbitControls, Text3D, Plane } from '@react-three/drei'
import * as d3 from 'd3'
import Event from './Event.jsx'
import StickyCurrentDate from './StickyCurrentDate.jsx'
import { data, datesOlympiques, datesParalympiques, disciplines } from '../../public/dataPrecompute.js'

// console.log(data, datesOlympiques, datesParalympiques)
// console.log(disciplines)

import Ticks from './Ticks.jsx'
import assignLevels from './assignLevels.js'

import config from '../config.js'
import flameUrl from '../../public/logo-circles.svg'
import interBoldUrl from '../../public/inter-bold.json'

function Timeline(props) {
  const scroll = useScroll()
  const uiRef = useRef()
  const [currentDate, setCurrentDate] = useState()
  const { activeIndex } = props

  const totalSize = config.totalSize
  // console.log(eventsWithLevels)

  // Filtrer les événements des jeux Paralympiques ou Olympiques
  const eventsToShow = data.filter((event) => {
    if (activeIndex === 0) return event.jeux === 'Paralympiques'
    if (activeIndex === 1) return event.jeux === 'Olympiques'
  })

  // Trouvez le dernier événement en fonction de la date de fin
  const lastEvent = eventsToShow.reduce((latest, current) => {
    const currentEndDate = new Date(current.fin)
    const latestEndDate = new Date(latest.fin)
    return currentEndDate > latestEndDate ? current : latest
  }, eventsToShow[0])

  // Calculez la durée du dernier événement
  const lastEventStartDate = new Date(lastEvent.debut)
  const lastEventEndDate = new Date(lastEvent.fin)
  const lastEventDuration = (lastEventEndDate - lastEventStartDate) / (1000 * 60 * 60 * 24) // Durée en jours

  // console.log(`Durée du dernier événement: ${lastEventDuration} jours`)

  // console.log('eventsToShow', eventsToShow)

  const timeline = d3.extent(eventsToShow, (d) => new Date(d.debut))
  const xScale = d3.scaleTime().domain(timeline).range([0, totalSize])
  const eventsWithLevels = assignLevels(eventsToShow, xScale)
  const maxLevel = (Math.max(...eventsWithLevels.map((event) => event.level)) + 1) * 3.2
  let maxTutorialScroll = 10

  useFrame(({ camera }) => {
    // console.log('scroll offset', scroll)
    if (scroll.offset > 3) {
      document.querySelector('#tutorial').classList.add('hidden')
    }
    if (!config.debugMode) {
      camera.position.x = scroll.offset * totalSize
      uiRef.current.position.x = scroll.offset * totalSize
    }
    // timelineRef.current.position.x = -scroll.offset * totalSize

    // Calculer la position actuelle en fonction du défilement
    const currentPosition = scroll.offset * totalSize
    // Convertir cette position en date en utilisant xScale.invert
    const date = xScale.invert(currentPosition)
    // console.log(date)
    // Calculer le mois et le jour
    const formatMonth = d3.timeFormat('%B')
    const formatDay = d3.timeFormat('%d')
    const formatHour = d3.timeFormat('%H')
    let month = formatMonth(date)
    const day = formatDay(date)
    const hour = formatHour(date)
    if (month === 'August') month = 'AOUT'
    else if (month === 'September') month = 'SEPTEMBRE'
    else if (month === 'July') month = 'JUILLET'
    // Mettre à jour currentDate avec les nouvelles valeurs
    setCurrentDate({ month, day, hour, date })
  })

  // Déterminer les dates de début et de fin en fonction de l'index actif
  const dates = activeIndex === 1 ? datesOlympiques : datesParalympiques
  const startDate = new Date(dates.ouverture)
  const endDate = new Date(dates.fermeture)

  // console.log('start', startDate)
  // console.log('end', endDate)

  // Formatter les dates
  const format = d3.timeFormat('%d-%m')
  const formattedStartDate = format(startDate)
  const formattedEndDate = format(endDate)
  const year = endDate.getFullYear()

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight intensity={1.5} position={[10, 10, 10]} />
      {config.debugMode ? (
        <>
          <PerspectiveCamera makeDefault position={[-20, maxLevel / 2, config.cameraDistance]} rotation={[0, 0, 0]} />
          <OrbitControls />
        </>
      ) : (
        <PerspectiveCamera
          makeDefault
          position={[0, maxLevel / 2, config.cameraDistance]}
          rotation={[0, -Math.PI / 10, 0]}
          far={config.farClipPlane}>
          {/* fov: config.fov, near: config.nearClipPlane, far: config.farClipPlane */}
          {/* THREE POINT LITGHING SYSTEM */}
          {/* <ambientLight intensity={Math.PI / 2} color={0xffffff} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={10} decay={0} intensity={Math.PI / 4} color={0xfbfbfb} />
          <pointLight decay={0} intensity={Math.PI / 4} /> */}
          {/* <ambientLight intensity={0.5} /> */}
        </PerspectiveCamera>
      )}
      <group ref={uiRef} position={[0, 0, 0]}>
        <StickyCurrentDate ref={uiRef} maxLevel={maxLevel} currentDate={currentDate} />
      </group>
      <Plane args={[totalSize, maxLevel]} position={[totalSize / 2, maxLevel / 2, -0.3]}>
        <meshBasicMaterial color={config.timelineBackgroundColor} />
      </Plane>
      <Text3D
        position={[2, maxLevel / 2 + 4, 0]}
        curveSegments={32}
        bevelEnabled
        bevelSize={0.2}
        bevelThickness={0.1}
        height={1}
        lineHeight={0.69}
        letterSpacing={-0.06}
        size={6.5}
        font={interBoldUrl}>
        {`Jeux\n${activeIndex == 1 ? 'Olympiques' : 'Paralympiques'}`}
        <meshStandardMaterial color="rgb(80,80,80)" />
        {/* <meshNormalMaterial /> */}
      </Text3D>
      {/* <Image position={[15, maxLevel / 2, 0.5]} scale={[30, 15, 1]} opacity={0.1} transparent url={flameUrl} /> */}
      <Text3D
        position={[config.totalSize + 2, maxLevel / 2 - 5, 0]}
        curveSegments={32}
        bevelEnabled
        bevelSize={0.2}
        bevelThickness={0.1}
        height={1}
        lineHeight={0.69}
        letterSpacing={-0.06}
        size={8.5}
        font={interBoldUrl}>
        {'Fin des jeux'}
        <meshStandardMaterial color="rgb(80,80,80)" />
        {/* <meshNormalMaterial /> */}
      </Text3D>
      <Text3D
        position={[2, maxLevel / 2 - 12.4, 0]}
        curveSegments={32}
        bevelEnabled
        // bevelSize={0.4}
        // bevelThickness={0.1}
        height={0.5}
        lineHeight={0.7}
        letterSpacing={-0.06}
        size={2.5}
        font={interBoldUrl}>
        {`du ${formattedStartDate} au ${formattedEndDate} ${year}`}

        <meshStandardMaterial color="rgb(200,200,200)" />
        {/* <meshNormalMaterial /> */}
      </Text3D>

      <Ticks startDate={timeline[0]} endDate={timeline[1]} scale={xScale} size={totalSize} maxLevel={maxLevel} />
      {eventsWithLevels.map((eventData, i) => (
        <Event
          key={i}
          data={{ ...eventData, xScale: xScale, index: i }}
          position={[eventData.start, eventData.level * 3.2 + 1.5 + 0.1, 0]} // Exemple de positionnement en fonction du niveau
        />
      ))}
    </>
  )
}
export default Timeline
