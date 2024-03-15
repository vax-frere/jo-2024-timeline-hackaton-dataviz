import { useRef } from 'react'

function CurrentTimeCursor(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()

  return (
    <group {...props}>
      <mesh ref={ref} position={[0, -0, 0]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color={'#0c0c0c'} />
      </mesh>
      <mesh ref={ref} position={[0, 10, 0]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color={'#0c0c0c'} />
      </mesh>
    </group>
  )
}
export default CurrentTimeCursor
