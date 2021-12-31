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
                <${Route} exact=${true} path=${`${PATHS["snippet"].url}/*`}>                    
                    <${SnippetPg} />
                <//>
                <${Route} path=${PATHS["alternative"].url}>   
                    <${Alternative} />
                <//>
                <${Route} exact=${true} path=${PATHS["proposal"].url}>                    
                    <${NewProposal} />
                <//>
                <${Route} exact=${true} path=${PATHS["taskGroup"].url}>                    
                    <${TaskGroup} />
                <//>
                <${Route} exact=${true} path=${PATHS["languageGroup"].url}>                    
                    <${LangGroup} />
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