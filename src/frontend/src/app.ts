import React from 'react'
import logo from './logo.svg'
import './app.css'
import ReactDOM from 'react-dom'
import Content from './content'
import { Provider } from 'react-redux'
import globalState from './redux/state'
import { html } from 'htm/react'


const App: React.FunctionComponent = () => {
    console.log("App")
    return html`
        <${Provider} store=${globalState}>
            <${Content} />
        <//>
    `
}

ReactDOM.render(
    html`<${React.StrictMode}>
      <${App} />
    <//>`,
    document.getElementById("snippetRoot")
)
