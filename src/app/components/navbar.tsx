'use client';

import React from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar, Box } from '@mui/material';

const Navbar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {['Dashboard', 'Etl Connection', 'Settings'].map((text, index) => (
            <ListItem key={text} component={'div'}>
              <ListItemText primary={text} onClick={() => console.log(text)}/>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Navbar;
