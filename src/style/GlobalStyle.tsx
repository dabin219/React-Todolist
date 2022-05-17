import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: "Helvetica", "Arial", sans-serif;
    font-weight: 400;
  }
  
  button {
    outline: none;
    cursor: pointer;
  }
`;

export default GlobalStyle;
