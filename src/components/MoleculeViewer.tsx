import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

interface Atom {
  element: string;
  x: number;
  y: number;
  z: number;
}

interface MoleculeViewerProps {
  moleculeData?: any;
}

const atomColors = {
  'C': '#959595',  // Carbon
  'H': '#FFFFFF',  // Hydrogen
  'O': '#FF0D0D',  // Oxygen
  'N': '#0070C0',  // Nitrogen
  'S': '#FFD700',  // Sulfur
  'P': '#FFA500',  // Phosphorus
  'default': '#808080' // Default color
};

export default function MoleculeViewer({ moleculeData }: MoleculeViewerProps) {
  const groupRef = useRef<any>(null);

  useEffect(() => {
    if (moleculeData) {
      // Scale the molecule to fit in the view
      const atoms = moleculeData.compound.properties.AtomArray;
      if (atoms) {
        const max = new Vector3(
          Math.max(...atoms.map(a => a.x)),
          Math.max(...atoms.map(a => a.y)),
          Math.max(...atoms.map(a => a.z))
        );
        const min = new Vector3(
          Math.min(...atoms.map(a => a.x)),
          Math.min(...atoms.map(a => a.y)),
          Math.min(...atoms.map(a => a.z))
        );

        const size = max.distanceTo(min);
        const scale = 1 / size;
        
        if (groupRef.current) {
          groupRef.current.scale.set(scale, scale, scale);
        }
      }
    }
  }, [moleculeData]);

  if (!moleculeData) {
    return null;
  }

  const atoms = moleculeData.compound.properties.AtomArray || [];

  return (
    <group ref={groupRef}>
      {atoms.map((atom: any, index: number) => {
        const element = atom.element;
        const color = atomColors[element] || atomColors['default'];
        return (
          <mesh key={index} position={[atom.x, atom.y, atom.z]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
}
