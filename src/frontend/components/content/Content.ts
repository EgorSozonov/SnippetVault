import React from "react"
import  { BrowserRouter, Switch, Route } from "react-router-dom"
import PATHS from "../../params/Path"
import SnippetPg from "../snippet/SnippetPg"
import Admin from "../admin/Admin"
import Group from "../group/Group"
import { html } from 'htm/react'
import "./app.css"


const Content: React.FunctionComponent = () => {
    return html`
    <${BrowserRouter}>
        <div class="browserRouter">            
            <${Switch}>
                <${Route} exact=${true} path=${PATHS["snippet"].url}>
                    b
                    <${SnippetPg} />
                <//>
                <${Route} exact=${true} path=${PATHS["group"].url}>
                    c
                    <${Group} />
                <//>
                <${Route} exact=${true} path=${PATHS["admin"].url}>
                    d
                    <${Admin} />
                <//>
                <${Route}>
                    <${SnippetPg} />
                <//>
            <//>
        </div>
    <//>
    `
}

export default Content