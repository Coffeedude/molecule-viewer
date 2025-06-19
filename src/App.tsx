import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box } from '@mui/material';
import SearchBar from './components/SearchBar';
import MoleculeViewer from './components/MoleculeViewer';

function App() {
  const [moleculeData, setMoleculeData] = useState<any>(null);

  const handleSearch = (compoundData: any) => {
    setMoleculeData(compoundData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <SearchBar onSearch={handleSearch} />
      <Box sx={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <MoleculeViewer moleculeData={moleculeData} />
        </Canvas>
      </Box>
    </Box>
  );
}

export default App;
