import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"
import "./icon.css"
import { ThemeProvider } from "./components/theme-provider"
import { HelmetProvider } from "react-helmet-async"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <HelmetProvider>
                    <App />
                </HelmetProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
)
