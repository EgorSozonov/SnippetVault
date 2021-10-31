import React from "react"
import  { BrowserRouter, Switch, Route } from "react-router-dom"
import PATHS from "../../params/Path"
import SnippetPg from "../snippet/SnippetPg"
import Admin from "../admin/Admin"
import Group from "../group/Group"
import { html } from 'htm/react'


const Content: React.FunctionComponent = () => {
    return html`
    <${BrowserRouter}>
        <div class="browserRouter">            
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
                <${Route}>
                    <${SnippetPg} />
                <//>
            <//>
        </div>
    <//>
    `
}

export default Content