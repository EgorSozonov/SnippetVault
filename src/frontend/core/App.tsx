import "./app.css"
import Content from "./components/content/Content"
import MainState from "./mobX/AllState"
import React from "react"
import {createContext, FunctionComponent } from "react"
import { render } from "react-dom"
import { CookiesProvider } from "react-cookie"


export const StoreContext = createContext<MainState>(new MainState())

export const StoreProvider: FunctionComponent<{children: any}> = ({ children, }) => {
    return (
        <StoreContext.Provider value={new MainState()}>
            {children}
        </StoreContext.Provider>
    )
}

export const App: FunctionComponent = () => {
    return (
        <StoreProvider>
            <CookiesProvider>
                <Content />
            </CookiesProvider>
        </StoreProvider>
    )

}

const root = document.getElementById("snippetRoot")
if (root) {
    render(<App />, root)
}
