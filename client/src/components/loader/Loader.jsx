import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loader() {
    return (
        <Box sx={{ height:'full',display: 'flex',justifyContent:'center',alignItems:'center' }}>
            <CircularProgress />
        </Box>
    );
}
