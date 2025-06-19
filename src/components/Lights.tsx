import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { AmbientLight, PointLight, DirectionalLight } from 'three';

export function Lights() {
  const { scene } = useThree();

  useEffect(() => {
    // Create ambient light
    const ambient = new AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    // Create directional light
    const directional = new DirectionalLight(0xffffff, 1);
    directional.position.set(10, 10, 10);
    directional.castShadow = true;
    directional.shadow.camera.near = 0.1;
    directional.shadow.camera.far = 100;
    directional.shadow.camera.left = -10;
    directional.shadow.camera.right = 10;
    directional.shadow.camera.top = 10;
    directional.shadow.camera.bottom = -10;
    scene.add(directional);

    // Create point light
    const point = new PointLight(0xffffff, 1);
    point.position.set(5, 5, 5);
    scene.add(point);

    // Clean up on unmount
    return () => {
      scene.remove(ambient);
      scene.remove(directional);
      scene.remove(point);
    };
  }, [scene]);

  return null;
}
