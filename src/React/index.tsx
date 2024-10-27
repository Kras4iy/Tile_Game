import React from 'react'
import { createRoot } from 'react-dom/client';
import "./index.css";
import Info from "./components/Info.tsx";

document.body.innerHTML = document.body.innerHTML + '<div id="devTools" class="devTools"></div>';

const ReactApp = () => {
    const root = createRoot(document.getElementById('devTools') as HTMLElement);
    root.render(<Info/>);
}

export default ReactApp;
