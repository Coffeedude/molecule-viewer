import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box } from '@mui/material';
import MoleculeViewer from './components/MoleculeViewer';
import SearchBar from './components/SearchBar';
import { Lights } from './components/Lights';
import './extensions/three-extensions';

function App() {
  const [moleculeData, setMoleculeData] = useState<any>(null);

  const handleSearch = (compoundData: any) => {
    setMoleculeData(compoundData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <SearchBar onSearch={handleSearch} />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ flex: 1, backgroundColor: '#1a1a1a' }}
        gl={{ backgroundColor: 'black' }}
      >
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <Lights />
        <MoleculeViewer moleculeData={moleculeData} />
      </Canvas>
    </Box>
  );
}

export default App;
