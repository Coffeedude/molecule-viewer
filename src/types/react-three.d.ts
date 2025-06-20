import { JSX } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: React.ComponentClass<React.ComponentProps<typeof THREE.Group>>;
      mesh: React.ComponentClass<React.ComponentProps<typeof THREE.Mesh>>;
      lineSegments: React.ComponentClass<React.ComponentProps<typeof THREE.LineSegments>>;
      lineBasicMaterial: React.ComponentClass<React.ComponentProps<typeof THREE.LineBasicMaterial>>;
      sphereGeometry: React.ComponentClass<React.ComponentProps<typeof THREE.SphereGeometry>>;
      textGeometry: React.ComponentClass<React.ComponentProps<typeof TextGeometry>>;
      meshStandardMaterial: React.ComponentClass<React.ComponentProps<typeof THREE.MeshStandardMaterial>>;
      group: React.ComponentClass<React.ComponentProps<typeof THREE.Group>>;
      mesh: React.ComponentClass<React.ComponentProps<typeof THREE.Mesh>>;
      lineSegments: React.ComponentClass<React.ComponentProps<typeof THREE.LineSegments>>;
      lineBasicMaterial: React.ComponentClass<React.ComponentProps<typeof THREE.LineBasicMaterial>>;
      sphereGeometry: React.ComponentClass<React.ComponentProps<typeof THREE.SphereGeometry>>;
      textGeometry: React.ComponentClass<React.ComponentProps<typeof TextGeometry>>;
      meshStandardMaterial: React.ComponentClass<React.ComponentProps<typeof THREE.MeshStandardMaterial>>;
    }
  }
}
