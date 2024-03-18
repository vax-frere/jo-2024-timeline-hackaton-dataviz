import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

const date = new Date()

import sunUrl from '../../public/sun.svg'
import moonUrl from '../../public/moon.svg'
import { OrbitControls, useScroll, Line, Html, Image, Text } from '@react-three/drei'

import { Counter } from './Counter'

import config from '../config.js'

function isNightTime(date) {
  // Ensure 'date' is a Date object
  if (!(date instanceof Date)) {
    console.error('The provided value is not a Date object.')
    return false
  }

  // Get the hour of the day (0-23)
  const hour = date.getHours()

  // Define night time as from 9 PM (21) to 6 AM (6)
  // Return true if hour is between 21 and 23 or between 0 and 5
  return hour >= config.nightLateTime || hour < config.nightEarlyTime
}

const zPos = -0.1

function StickyCurrentDate(props) {
  return (
    <group position={props.position}>
      <Counter
        value={parseInt(props.currentDate?.day)}
        // suffix={props.currentDate?.month}
        position={[-3, props.maxLevel - 7.3, zPos - 0.05]}
        color={'black'}
        anchorX="left"
        anchorY="top"
      />
      <Text
        children={props.currentDate?.month}
        textAlign={'left'}
        anchorX={'left'}
        anchorY="bottom"
        color={'black'}
        position={[13, props.maxLevel - 6.4, zPos - 0.05]}
        fontSize={2.5}
      />
      <Text
        // position={[-5, props.maxLevel - 3.7, zPos - 0.05]}
        position={[13, props.maxLevel - 9.6, zPos - 0.05]}
        color={config.bigHourLabelColor}
        textAlign={'left'}
        anchorX="left"
        anchorY="bottom"
        fontSize={2.5}>
        {props.currentDate?.hour + 'h'}
      </Text>
      {props.activeSport !== '' && props.activeSport !== null ? (
        <>
          <Text
            // position={[-5, props.maxLevel - 3.7, zPos - 0.05]}
            position={[3, props.maxLevel - 13.6, zPos - 0.05]}
            color={config.bigHourLabelColor}
            textAlign={'left'}
            anchorX="left"
            anchorY="bottom"
            fontSize={1.2}>
            FILTRE ACTIF
          </Text>

          <Text
            // position={[-5, props.maxLevel - 3.7, zPos - 0.05]}
            position={[3, props.maxLevel - 16.6, zPos - 0.05]}
            color={'black'}
            textAlign={'left'}
            anchorX="left"
            anchorY="bottom"
            fontSize={2.5}>
            {props.activeSport}
          </Text>
        </>
      ) : null}

      {/* {isNightTime(props.currentDate?.date) ? (
        <Image position={[-5, props.maxLevel - 5.7, zPos + 2.5]} scale={[4, 4, 1]} opacity={0.2} transparent url={moonUrl} />
      ) : (
        ''
      )} */}
      {/* <Text position={[3, props.maxLevel - 3.3, zPos - 0.05]} color={'black'} anchorX="left" anchorY="top" fontSize={4}>
        {props.currentDate?.day} {props.currentDate?.month}
      </Text> */}
      <Line
        points={[
          [0, props.maxLevel, 0],
          [0, 0, 0]
        ]}
        color={'black'}
        lineWidth={3}
      />
    </group>
  )
}
export default StickyCurrentDate
