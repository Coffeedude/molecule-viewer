import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Alert } from '@mui/material';

interface SearchBarProps {
  onSearch: (compoundData: any) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchTerm)}/cids/JSON`);
      const data = await response.json();

      if (data && data.IdentifierList && data.IdentifierList.CID && data.IdentifierList.CID.length > 0) {
        const cid = data.IdentifierList.CID[0];
        const sdfResponse = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF/JSON`);
        const sdfData = await sdfResponse.json();
        
        onSearch(sdfData.PC_Compounds[0]);
      } else {
        setError('No compound found with that name');
      }
    } catch (err) {
      setError('Error fetching compound data');
      console.error('Error:', err);
    } finally {
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
