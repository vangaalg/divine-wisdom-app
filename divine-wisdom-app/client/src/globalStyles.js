import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.background};
    background: linear-gradient(135deg, #0f0524 0%, #3b0d4a 30%, #5e1a87 60%, #341d5e 100%);
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
    color: ${theme.colors.textPrimary};
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.krishnaBlue};
    letter-spacing: 0.5px;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  p {
    margin-bottom: ${theme.spacing.md};
  }

  a {
    color: ${theme.colors.krishnaBlue};
    text-decoration: none;
    transition: ${theme.transitions.default};
    
    &:hover {
      color: ${theme.colors.peacockFeather};
    }
  }

  button {
    cursor: pointer;
    font-family: ${theme.fonts.body};
    border: none;
    transition: ${theme.transitions.default};
  }

  input, textarea {
    font-family: ${theme.fonts.body};
    font-size: 1rem;
    padding: ${theme.spacing.md};
    border: 1px solid #ddd;
    border-radius: ${theme.borderRadius.small};
    transition: ${theme.transitions.default};
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.krishnaBlue};
      box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
    }
  }

  /* Add a radial gradient overlay to create a divine glow on the body */
  #root {
    position: relative;
    min-height: 100vh;
    
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at top right, 
                                  rgba(255, 193, 7, 0.15), 
                                  transparent 70%);
      pointer-events: none;
      z-index: -1;
    }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(26, 35, 126, 0.05);
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.krishnaBlue};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.purple};
  }

  /* Krishna quotes styling */
  .krishna-quote {
    font-style: italic;
    border-left: 3px solid ${theme.colors.gold};
    padding-left: ${theme.spacing.md};
    margin: ${theme.spacing.lg} 0;
    background-color: rgba(26, 35, 126, 0.05);
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.small};
  }
`;

export default GlobalStyles; 