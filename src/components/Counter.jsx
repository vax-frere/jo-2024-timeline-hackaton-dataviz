import { useRef } from 'react'
import { easing } from 'maath'
import { useFrame } from '@react-three/fiber'
import { Text, Mask, useMask } from '@react-three/drei'

export const Counter = ({ value, ...props }) => {
  // Convertissez la valeur en chaîne et ajoutez un 0 devant si nécessaire pour garantir une longueur de 2
  const formattedValue = `${value}`.padStart(2, '0')

  return (
    <group {...props}>
      {/* Utilisez la valeur formatée ici. 
            En ajoutant des étoiles devant pour maintenir le design original avec un padding d'étoiles,
            assurez-vous que la longueur de la chaîne est toujours de 4 caractères. */}
      {[...`✨✨${formattedValue}`.slice(-4)].map((num, index) => (
        <CounterInner index={index} value={num === '✨' ? -1 : num} key={index} speed={0.1 * (8 - index)} />
      ))}

      <Mask id={1}>
        <planeGeometry args={[30, 7.2]} />
      </Mask>
    </group>
  )
}

function CounterInner({ index, value, speed = 0.1 }) {
  const ref = useRef()
  const stencil = useMask(1)
  useFrame((state, delta) => easing.damp(ref.current.position, 'y', value * -7.2, speed, delta))
  return (
    <group position-x={index * 4} ref={ref}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <Text key={number} position={[0, number * 7.2, 0]} color={'black'} fontSize={7.2}>
          {number}
          <meshBasicMaterial {...stencil} />
        </Text>
      ))}
    </group>
  )
}
