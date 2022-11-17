import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./components/App";
// import './styles/globals.scss'
import App from "./components/App";
import './styles/globals.scss'
import "./styles/board.scss"
import "./styles/chess.scss"
import "./styles/settings.scss"
// import './styles/header.scss'
import { GeneralStyles } from "./styles/general";
import "./styles/globals.scss"

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  //   <Router>
  //     <App />
  //   </Router>
  // </React.StrictMode>
  <>
    <GeneralStyles />
    <App />
  </>



);
