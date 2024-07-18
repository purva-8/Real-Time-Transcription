import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#888888',
    },
    background: {
      default: '#f0f0f0',
    },
    text: {
      primary: '#000000',
      secondary: '#888888',
    },
  },
  typography: {
    h4: {
      color: '#000000',
    },
    body1: {
      color: '#000000',
    },
  },
});

export default theme;
