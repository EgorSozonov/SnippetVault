import React from 'react'
import logo from './logo.svg'
import './app.css'
import ReactDOM from 'react-dom'
import Content from './content'
import { Provider } from 'react-redux'
import globalState from './redux/state'


const App: React.FunctionComponent = () => {
    return (<Provider store={globalState}>
        <Content />
        </Provider>
    );
}


ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("snippetRoot")
  );
