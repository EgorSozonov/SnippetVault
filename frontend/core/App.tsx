import "./app.css"
import Content from "./components/content/Content"
import MainState from "./mobX/AllState"
import React from "react"
import {createContext, FunctionComponent } from "react"
import { render } from "react-dom"


export const storeContext = createContext<MainState>(new MainState())

export const StoreProvider: FunctionComponent<{children: any}> = ({ children, }) => {
    return (
        <storeContext.Provider value={new MainState()}>
            {children}
        </storeContext.Provider>
    )
}

export const App: FunctionComponent = () => {
    return (
        <StoreProvider>
            <Content />
        </StoreProvider>
    )

}

const root = document.getElementById("snippetRoot")
if (root) {
    render(<App />, root)
}
