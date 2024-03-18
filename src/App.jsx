import { useRef, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ScrollControls, PerspectiveCamera, Grid, Text, Stats, Loader } from '@react-three/drei'
import Timeline from './components/Timeline.jsx'
import StaticCurrentTimeCursor from './components/StaticCurrentTimeCursor.jsx'
import Menu from './components/Menu.jsx'
import config from './config.js'

function App() {
  const [activeIndex, setActiveIndex] = useState(1)
  const [isLoading, setIsLoading] = useState(true) // Ajoutez un état pour suivre le chargement

  //

  return (
    <>
      {!isLoading && (
        <div id="preloader">
          <p>Chargement...</p>
        </div>
      )}

      <Suspense
        fallback={
          <Loader
            dataInterpolation={(p) => `Chargement ${p.toFixed(2)}%`} // Affiche le pourcentage de chargement
            onLoaded={() => {
              // console.log(123)
              // // setIsLoading(false)
              // // ajoute la classe loaded au body
              // document.body.classList.add('loaded')
            }} // Quand le chargement est terminé, mettez à jour l'état
          />
        }>
        <>
          {document.body.classList.add('loaded')}
          <div id="legend">
            {'Légende :\n'}
            {config.colorScaleDomain.map((eventType, i) => (
              <span key={i}>
                {eventType}
                <span className="circle" style={{ backgroundColor: config.colorScaleRange[i] }}></span>
              </span>
            ))}
          </div>
          <Canvas powerPreference="high-performance" gl={{ antialias: true, alpha: true }}>
            {config.showStats && <Stats />}
            <color attach="background" args={[config.backgroundColor]} />
            <ScrollControls pages={4.7} damping={0.3}>
              <StaticCurrentTimeCursor />
              <Timeline activeIndex={activeIndex} />
            </ScrollControls>
          </Canvas>
          <Menu activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </>
      </Suspense>
    </>
  )
}

export default App
