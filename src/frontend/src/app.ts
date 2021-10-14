import './app.css'
import Content from './content'
import { html } from 'htm/react'
import MainState from './MobX/MainState'
import {createContext, h, render, FunctionComponent, ComponentChildren} from "preact"


export const StoreContext = createContext<MainState>(new MainState())

export const StoreProvider: FunctionComponent<{children: ComponentChildren}> = ({ children, }) => {
    return (html`${StoreContext.Provider} value=${new MainState()}>{children}<//>`)
}

const App: FunctionComponent = () => {
    return html`       
            <${Content} />
    `
}

const root = document.getElementById("snippetRoot")
if (root) {
    render(
        html`
            <${StoreProvider}>
              <${Content} />
            <//>
        `,    
        root
    )
}
