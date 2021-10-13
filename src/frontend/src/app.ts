import React, { createContext, FC, ReactNode, ReactElement, } from 'react'
import logo from './logo.svg'
import './app.css'
import ReactDOM from 'react-dom'
import Content from './content'
import { html } from 'htm/react'
import MainState from './MobX/MainState'


export const StoreContext = createContext<MainState>(new MainState())

export const StoreProvider: FC<{children: ReactNode}> = ({ children, }): ReactElement => {
    return (html`${StoreContext.Provider} value=${new MainState()}>{children}<//>`)
}

const App: React.FunctionComponent = () => {
    return html`
        <${StoreProvider}>
            <${Content} />
        <//>
    `
}

ReactDOM.render(
    html`
        <${React.StrictMode}>
          <${App} />
        <//>
    `,    
    document.getElementById("snippetRoot")
)
