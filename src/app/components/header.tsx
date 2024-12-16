'use client';

import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { AutoFixHigh } from '@mui/icons-material';

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" alignItems={"center"}>
         <AutoFixHigh />  ETL Builder By Najib Zulfan
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
