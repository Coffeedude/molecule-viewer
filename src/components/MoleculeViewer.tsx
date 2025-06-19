import React, { useRef, useEffect } from 'react';
import { Vector3, BufferGeometry, Float32BufferAttribute } from 'three';
import { Box } from '@mui/material';
import { useThree, useFrame, useLoader } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Atom, Bond, Compound } from './types';

interface MoleculeViewerProps {
  moleculeData: Compound | null;
}

const atomColors = {
  'C': '#959595',  // Carbon
  'H': '#FFFFFF',  // Hydrogen
  'O': '#FF0D0D',  // Oxygen
  'N': '#0000FF',  // Nitrogen
  'S': '#FFFF00',  // Sulfur
  'P': '#FFA500',  // Phosphorus
  'default': '#CCCCCC'  // Default color
};

export default function MoleculeViewer({ moleculeData }: MoleculeViewerProps) {
  const groupRef = useRef<any>(null);
  const font = useLoader(FontLoader, '/fonts/helvetiker_regular.typeface.json');

  useEffect(() => {
    if (moleculeData) {
      console.log('Rendering molecule:', moleculeData);
      
      const atoms = moleculeData?.properties.AtomArray;
      const bonds = moleculeData?.properties.BondArray;
      
      if (!atoms || !bonds) {
        console.error('Invalid molecule data:', moleculeData);
        return;
      }

      if (atoms.length === 0) {
        console.error('No atoms found in molecule data');
        return;
      }

      // Calculate bounding box
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

      // Calculate size and center
      const size = max.distanceTo(min);
      const center = new Vector3(
        (max.x + min.x) / 2,
        (max.y + min.y) / 2,
        (max.z + min.z) / 2
      );

      console.log('Molecule size:', size, 'Center:', center);

      // Scale to fit in view (target size of 2 units)
      const targetSize = 2;
      const scale = targetSize / size;
      
      if (groupRef.current) {
        groupRef.current.scale.set(scale, scale, scale);
        groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      }
    }
  }, [moleculeData]);

  if (!moleculeData) {
    return null;
  }

  const atoms = moleculeData?.properties.AtomArray || [];
  const bonds = moleculeData?.properties.BondArray || [];

  console.log('Atoms:', atoms.length, 'Bonds:', bonds.length);

  // Create bond geometry
  const positions = new Float32Array(bonds.length * 6); // 6 floats per bond (3 for start, 3 for end)
  bonds.forEach((bond: any, index: number) => {
    // PubChem indices are 1-based, no need to subtract 1
    const atom1 = atoms[bond.beginAtom];
    const atom2 = atoms[bond.endAtom];
    
    if (!atom1 || !atom2) {
      console.error('Invalid bond connection:', bond);
      return;
    }

    const offset = index * 6;
    positions[offset + 0] = atom1.x;
    positions[offset + 1] = atom1.y;
    positions[offset + 2] = atom1.z;
    positions[offset + 3] = atom2.x;
    positions[offset + 4] = atom2.y;
    positions[offset + 5] = atom2.z;
  });

  const bondGeometry = new BufferGeometry();
  bondGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

  return (
    <group ref={groupRef}>
      {/* Bonds */}
      <lineSegments geometry={bondGeometry}>
        <lineBasicMaterial 
          attach="material" 
          color="#808080" 
          linewidth={4} 
          transparent={true}
          opacity={0.8}
        />
      </lineSegments>

      {/* Atoms */}
      {atoms.map((atom: any, index: number) => {
        const element = atom.element as keyof typeof atomColors;
        const color = atomColors[element] || atomColors['default'];
        return (
          <group key={index} position={[atom.x, atom.y, atom.z]}>
            {/* Atom sphere */}
            <mesh>
              <sphereGeometry attach="geometry" args={[0.2, 32, 32]} />
              <meshStandardMaterial 
                attach="material" 
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
              />
            </mesh>
            
            {/* Atom label */}
            <mesh position={[0, 0.3, 0]}>
              <textGeometry 
                attach="geometry" 
                args={[element, { 
                  font: font,
                  size: 0.15,
                  height: 0.01,
                  curveSegments: 12,
                  bevelEnabled: false
                }]} 
              />
              <meshStandardMaterial 
                attach="material" 
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
