import './app.css'
import Content from './components/content/Content'
import { html } from 'htm/react'
import MainState from './MobX/MainState'
import {createContext, FunctionComponent,} from "react"
import { render } from "react-dom"


export const StoreContext = createContext<MainState>(new MainState())

export const StoreProvider: FunctionComponent<{children: any}> = ({ children, }) => {
    return (html`<${StoreContext.Provider} value=${new MainState()}>${children}<//>`)
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
