import React from "react"
import  { BrowserRouter, Switch, Route } from "react-router-dom"
import PATHS from "./path"
import SnippetPg from "./components/snippet/snippetPg"
import Admin from "./components/admin/admin"
import Group from "./components/group/group"
import { html } from 'htm/react'


const Content: React.FunctionComponent = () => {
    console.log("Content render")
    return html`
    <${BrowserRouter}>
        <div style="background-color: #303030; scrollbar-width: thin;">
            <${Switch}>
                <${Route} exact=${true} path=${PATHS["snippet"].url}>
                    <${SnippetPg} />
                <//>
                <${Route} exact=${true} path=${PATHS["group"].url}>
                    <${Group} />
                <//>
                <${Route} exact=${true} path=${PATHS["admin"].url}>
                    <${Admin} />
                <//>
            <//>
        </div>
    <//>
    `
}

export default Content