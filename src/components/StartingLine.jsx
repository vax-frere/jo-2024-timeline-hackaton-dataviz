import React from 'react'
import { Plane, useTexture } from '@react-three/drei'

const StartingLine = ({ position, size, density, length, color1, color2 }) => {
  const planes = []

  const squareSize = size / density // Taille de chaque carré

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < density; j++) {
      const xPos = position[0] + squareSize * i + squareSize / 2 - (length * squareSize) / 2
      const yPos = position[1] + squareSize * j + squareSize / 2 - size / 2

      const color = (i + j) % 2 === 0 ? color1 : color2

      planes.push(
        <Plane key={`${i}-${j}`} args={[squareSize, squareSize]} position={[xPos, yPos, position[2]]}>
          <meshBasicMaterial attach="material" color={color} />
        </Plane>
      )
    }
  }

  return <>{planes}</>
}

export default StartingLine
