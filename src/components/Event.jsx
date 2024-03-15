import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Html, Line } from '@react-three/drei'
import * as d3 from 'd3'
import config from '../config.js'

function Event(props, p = new THREE.Vector3()) {
  // This reference gives us direct access to the THREE.Mesh object
  const material = useRef()
  const offset = props.position[1]
  // const color = props.data.jeux.includes('Para') ? '#FFB0F1' : '#46B9E3'
  const colorScale = d3.scaleOrdinal().range(config.colorScaleRange).domain(config.colorScaleDomain)

  const { clicked } = useRef()
  const [hovered, hover] = useState(false)
  const click = () => (state.clicked = index === clicked ? null : index)
  const over = () => hover(true)
  const out = () => hover(false)
  // useEffect(() => {
  //   clicked.current = ref.current.getObjectByName(params?.id)
  //   if (clicked.current) {
  //     clicked.current.parent.updateWorldMatrix(true, true)
  //     clicked.current.parent.localToWorld(p.set(0, 1, 1.25))
  //   } else {
  //     p.set(0, 0, 5.5)
  //   }
  // })
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    material.current.opacity = 0.8
    if (hovered) {
      material.current.opacity = 1
    }
  })

  // Return the view, these are regular Threejs elements expressed in JSX
  function formatDuration(decimalHours) {
    const hours = Math.floor(decimalHours) // Récupère la partie entière pour les heures
    const minutes = Math.round((decimalHours - hours) * 60) // Convertit la partie décimale en minutes
    return `${hours}h${minutes.toString().padStart(2, '0')}` // Formate le string en ajoutant un zéro si nécessaire
  }
  const xPos = props.data.xScale(new Date(props.data.debut))
  const eventLength = props.data.xScale(new Date(props.data.fin)) - xPos
  return (
    <group position={[xPos, offset, 0]}>
      <mesh position={[eventLength / 2, 0, -config.eventWeight / 2]} onPointerOver={over} onPointerOut={out}>
        <boxGeometry args={[eventLength, config.eventHeight, config.eventWeight]} />
        <meshStandardMaterial
          ref={material}
          color={colorScale(props.data.enjeu)}
          opacity={0.7}
          transparent
          // toneMapped={false}
          onClick={click}
        />
      </mesh>
      <Text
        // font={interFont}
        color={config.eventLabelColor}
        anchorX="right"
        anchorY="middle"
        fontSize={1.2}
        position={[eventLength - 1, -0.05, -0.1]}
        textAlign="right"
        transparent
        opacity={0.3}>
        {props.data.lieu} - {formatDuration(props.data.duree)}
      </Text>
      <Text
        // font={interFont}
        color={config.eventLabelColor}
        anchorX="left"
        anchorY="middle"
        fontSize={1.9}
        fontWeight={'900'}
        maxWidth={300}
        lineHeight={1}
        letterSpacing={0.02}
        position={[1, -0.2, 0.1]}
        textAlign="left">
        {props.data.discipline}
      </Text>
      {/* <Text color={config.eventLabelColor} anchorX="left" anchorY="middle" fontSize={0.8} position={[0.2, -1, 0.02]}>
        {props.data.lieu}
      </Text> */}
      {/* <Line
        points={[
          [0, -1.5, -0.5],
          [0, 1.5, -0.5]
        ]}
        color="black"
        lineWidth={1}
        center={false}
        dashed={false}
      /> */}
    </group>
  )
}
export default Event
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
