import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSpring } from '@react-spring/core'
import { OrbitControls, Text, Html, Line } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'
import * as d3 from 'd3'
import config from '../config.js'

const state = proxy({ clicked: null })

function Event(props, p = new THREE.Vector3()) {
  // This reference gives us direct access to the THREE.Mesh object
  const meshRef = useRef()
  const fontMaterialRef1 = useRef()
  const fontMaterialRef2 = useRef()
  const activeSport = props.activeSport
  const setActiveSport = props.setActiveSport
  const { clicked } = useSnapshot(state)

  const offset = props.position[1]
  // const color = props.data.jeux.includes('Para') ? '#FFB0F1' : '#46B9E3'
  const colorScale = d3.scaleOrdinal().range(config.colorScaleRange).domain(config.colorScaleDomain)

  const label = props.data.discipline === 'Cérémonie' ? props.data.epreuve : props.data.discipline

  const [isHovered, setIsHover] = useState(false)
  const over = () => setIsHover(true)
  const out = () => setIsHover(false)

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    // console.log(clicked)
    if (activeSport === null) {
      meshRef.current.material.opacity = 0.7
      fontMaterialRef1.current.opacity = 1
      fontMaterialRef2.current.opacity = 1
    } else {
      if (meshRef.current.material.name === activeSport) {
        meshRef.current.material.opacity = 0.7
        fontMaterialRef1.current.opacity = 1
        fontMaterialRef2.current.opacity = 1
      } else {
        meshRef.current.material.opacity = 0.2
        fontMaterialRef1.current.opacity = 0.3
        fontMaterialRef2.current.opacity = 0.3
      }
    }

    if (isHovered) {
      meshRef.current.material.opacity = 0.75
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
      <mesh
        ref={meshRef}
        position={[eventLength / 2, 0, -config.eventWeight / 2]}
        onPointerOver={over}
        onPointerOut={out}
        onPointerMissed={(e) => setActiveSport(null)}
        onClick={(e) => setActiveSport(props.data.discipline)}>
        <boxGeometry args={[eventLength, config.eventHeight, config.eventWeight]} />
        <meshStandardMaterial name={props.data.discipline} color={colorScale(props.data.enjeu)} opacity={1} transparent />
      </mesh>
      {/* {console.log(props.data.epreuve)} */}

      <Text
        // font={interFont}
        color={config.eventLabelColor}
        anchorX="left"
        anchorY="middle"
        fontSize={1.9}
        position={[0.7, -0.2, 0.1]}
        fontWeight={'900'}
        maxWidth={300}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="left">
        {label}
        <meshStandardMaterial ref={fontMaterialRef1} attach="material" opacity={0.9} />
      </Text>
      <Text
        // font={interFont}
        color={config.eventLabelColor}
        anchorX="right"
        anchorY="middle"
        fontSize={1.2}
        position={[eventLength - 1, -0.15, -0.1]}
        textAlign="right">
        {props.data.lieu} - {formatDuration(props.data.duree)}
        <meshStandardMaterial
          visible={!(label.length > 5 && props.data.duree <= 1.2)}
          ref={fontMaterialRef2}
          attach="material"
          opacity={1}
        />
      </Text>
      {/* <Text color={config.eventLabelColor} anchorX="left" anchorY="middle" fontSize={0.8} position={[0.2, -1, 0.02]}>
        {props.data.lieu}
      </Text> */}
      <Line
        points={[
          [0, -1.5, 0],
          [0, 1.5, 0]
        ]}
        color="rgb(0,0,0)"
        transparent
        opacity={0.15}
        lineWidth={1}
        center={false}
        dashed={false}
      />
      <Line
        points={[
          [eventLength, -1.5, 0],
          [eventLength, 1.5, 0]
        ]}
        color="rgb(0,0,0)"
        transparent
        opacity={0.15}
        lineWidth={1}
        center={false}
        dashed={false}
      />
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
