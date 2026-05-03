import React from 'react'
import ReactDOM from 'react-dom/client'
import "../index.css"
import Popup from './popup';

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <Popup />
        </React.StrictMode>,
    )
} else {
    console.error("Could not find the root element in index.html");
}