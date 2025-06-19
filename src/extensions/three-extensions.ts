import { extend } from '@react-three/fiber';
import { LineSegments, LineBasicMaterial, SphereGeometry, MeshStandardMaterial, Group } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

extend({
  LineSegments,
  LineBasicMaterial,
  SphereGeometry,
  MeshStandardMaterial,
  TextGeometry,
  Group,
});
