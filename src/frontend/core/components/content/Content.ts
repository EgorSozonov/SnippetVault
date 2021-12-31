import React from "react"
import  { BrowserRouter, Routes, Route } from "react-router-dom"
import PATHS from "../../params/Path"
import SnippetPg from "../snippet/SnippetPg"
import Admin from "../admin/Admin"
import { html } from 'htm/react'
import TaskGroup from "../admin/TaskGroup"
import LangGroup from "../admin/LangGroup"
import NewProposal from "../admin/NewProposal"
import Alternative from "../alternative/AlternativePg"


const Content: React.FunctionComponent = () => {
    
    return html`
        <${BrowserRouter}>
            <div class="browserRouter">
                <${Routes}>
                    <${Route} exact="true" path=${`${PATHS["snippet"].url}`} element=${html`<${SnippetPg} />`} />                    
                    <${Route} exact="true" path=${PATHS["alternative"].url} element=${html`<${Alternative} />`} />
                    <${Route} exact="true" path=${PATHS["proposal"].url} element=${html`<${NewProposal} />`} />                         
                    <${Route} exact="true" path=${PATHS["taskGroup"].url} element=${html`<${TaskGroup} />`} /> 
                    <${Route} exact="true" path=${PATHS["languageGroup"].url} element=${html`<${LangGroup} />`} />
                    <${Route} exact="true" path=${PATHS["admin"].url} element=${html`<${Admin} />`} /> 
                    <${Route} path="/" element=${html`<${SnippetPg} />`} />
                <//>
            </div>
        <//>
    `
}

export default Content