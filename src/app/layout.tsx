'use client';

import React from 'react';
import { CssBaseline, Box, Grid } from '@mui/material';
import Navbar from './components/navbar';
import Header from './components/header';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Provider } from './utils/provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <Grid container sx={{ height: '100vh' }}>
          {/* Navbar (Kolom 1) */}
          <Grid item sx={{ width: 240 }}>
            <Navbar />
          </Grid>

          {/* Main Content (Kolom 2) */}
          <Grid item xs>
            <Box display="flex" flexDirection="column" height="100%">
              {/* Header */}
              <Header />

              {/* Page Content */}
              <Box component="main" p={3} mt={8} flexGrow={1}>
                <Provider>{children}</Provider>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </body>
    </html>
  );
}
