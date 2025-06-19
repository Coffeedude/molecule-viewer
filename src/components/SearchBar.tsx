import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import { Atom, Bond, Compound, createCompound } from './types';

interface SearchBarProps {
  onSearch: (compoundData: Compound) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      console.log('Starting search for:', searchTerm);
      setLoading(true);
      setError(null);
      
      // Step 1: Fetch CID
      console.log('Fetching CID for:', searchTerm);
      const cidResponse = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchTerm)}/cids/JSON`);
      console.log('CID Response status:', cidResponse.status);
      
      const cidData = await cidResponse.json();
      console.log('CID Response data:', cidData);

      if (!cidResponse.ok) {
        const errorText = await cidResponse.text();
        console.error('CID Fetch Error:', {
          status: cidResponse.status,
          statusText: cidResponse.statusText,
          response: errorText
        });
        throw new Error(`CID fetch failed: ${cidResponse.status} ${cidResponse.statusText}. Response: ${errorText}`);
      }

      if (cidData && cidData.IdentifierList && cidData.IdentifierList.CID && cidData.IdentifierList.CID.length > 0) {
        const cid = cidData.IdentifierList.CID[0];
        console.log('Found CID:', cid);

        // Step 2: Fetch compound data in SDF format with 3D coordinates
        console.log('Fetching compound data for CID:', cid);
        const compoundResponse = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF?record_type=3d`);
        console.log('Compound Response status:', compoundResponse.status);
        
        if (!compoundResponse.ok) {
          const errorText = await compoundResponse.text();
          console.error('Compound Fetch Error:', {
            status: compoundResponse.status,
            statusText: compoundResponse.statusText,
            response: errorText
          });
          throw new Error(`Compound fetch failed: ${compoundResponse.status} ${compoundResponse.statusText}. Response: ${errorText}`);
        }
        
        const sdfData = await compoundResponse.text();
        console.log('Raw SDF data:', sdfData);
        
        try {
          // Step 3: Parse SDF
          const compound = createCompound();

          // Parse SDF data
          const lines = sdfData.split('\n');
          
          // Find the atom count line (4th line in SDF)
          const atomCountLine = lines[3];
          const atomCount = parseInt(atomCountLine.substring(0, 3).trim());
          console.log('Atom count:', atomCount);

          // Parse atoms (starting from line 4)
          for (let i = 4; i < 4 + atomCount; i++) {
            const atomLine = lines[i];
            const x = parseFloat(atomLine.substring(0, 10).trim());
            const y = parseFloat(atomLine.substring(10, 20).trim());
            const z = parseFloat(atomLine.substring(20, 30).trim());
            const element = atomLine.substring(31, 34).trim();
            
            const atomData: Atom = {
              x,
              y,
              z,
              element
            };
            compound.properties.AtomArray.push(atomData);
            console.log('Parsed atom:', atomData);
          }

          // Parse bonds (starting after atoms)
          const bondCount = parseInt(atomCountLine.substring(3, 6).trim());
          console.log('Bond count:', bondCount);
          
          for (let i = 4 + atomCount; i < 4 + atomCount + bondCount; i++) {
            const bondLine = lines[i];
            const beginAtom = parseInt(bondLine.substring(0, 3).trim()) - 1; // Convert to 0-based index
            const endAtom = parseInt(bondLine.substring(3, 6).trim()) - 1;
            const bondType = parseInt(bondLine.substring(6, 9).trim());
            
            const bondData: Bond = {
              beginAtom,
              endAtom,
              bondType
            };
            compound.properties.BondArray.push(bondData);
            console.log('Parsed bond:', bondData);
          }

          console.log('Finished parsing compound:', compound);
          onSearch(compound);
        } catch (parseError: unknown) {
          console.error('Detailed parsing error:', {
            error: parseError,
            message: parseError instanceof Error ? parseError.message : String(parseError)
          });
          throw new Error('Failed to parse molecular data');
        }
      } else {
        setError('No compound found with that name');
      }
    } catch (err: unknown) {
      console.error('Detailed error:', {
        error: err,
        message: err instanceof Error ? err.message : String(err)
      });
      setError('Error fetching compound data');
    } finally {
      console.log('Search complete');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter compound name..."
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={loading}
          />
          <Button
            variant="contained"
            type="submit"
            sx={{ minWidth: 100 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>
      </form>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
