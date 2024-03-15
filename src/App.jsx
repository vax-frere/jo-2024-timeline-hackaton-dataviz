import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ScrollControls, PerspectiveCamera, Grid, Text, Stats, Loader } from '@react-three/drei'
import Timeline from './components/Timeline.jsx'
import StaticCurrentTimeCursor from './components/StaticCurrentTimeCursor.jsx'
import Menu from './components/Menu.jsx'
import config from './config.js'

export default function App() {
  const [activeIndex, setActiveIndex] = useState(1)
  return (
    <>
      <Loader />
      <div id="legend">
        {'Légende :\n'}
        {config.colorScaleDomain.map((eventType, i) => (
          <span key={i}>
            {eventType}
            <span className="circle" style={{ backgroundColor: config.colorScaleRange[i] }}></span>
          </span>
        ))}
      </div>
      <Canvas
        // camera={{ fov: config.fov, near: config.nearClipPlane, far: config.farClipPlane }}
        powerPreference="high-performance"
        gl={{ antialias: true, alpha: false }}>
        {/* {config.showStats && (
          <>
            <Stats />
          </>
        )} */}
        {/* <axesHelper scale={40} position={[0, 0, 0]} onUpdate={(self) => self.setColors('#ff2080', '#20ff80', '#2080ff')} /> */}
        {/* <Grid scale={1} /> */}

        <color attach="background" args={[config.backgroundColor]} />
        <ScrollControls pages={4.7} damping={0.5}>
          <StaticCurrentTimeCursor />
          <Timeline activeIndex={activeIndex} />
        </ScrollControls>
      </Canvas>
      <Menu activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
    </>
  )
}
