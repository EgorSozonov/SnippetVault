import './app.css'
import Content from './components/content/Content'
import { html } from 'htm/react'
import MainState from './mobX/AllState'
import {createContext, FunctionComponent,} from "react"
import { render } from "react-dom"
import { CookiesProvider } from 'react-cookie'


export const StoreContext = createContext<MainState>(new MainState())

export const StoreProvider: FunctionComponent<{children: any}> = ({ children, }) => {
    return (html`
        <${StoreContext.Provider} value=${new MainState()}>
            ${children}
        <//>`)
}

export const App: FunctionComponent = () => {
    return html`
            <${StoreProvider}>
                <${CookiesProvider}>
                    <${Content} />
                <//>
            <//>
    `
}

const root = document.getElementById("snippetRoot")
if (root) {
    render(html`<${App} />`, root)
}
