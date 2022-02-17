import React from "react"
import  { BrowserRouter, Routes, Route } from "react-router-dom"
import PATHS from "../../params/Path"
import SnippetPg from "../snippet/SnippetPg"
import Admin from "../admin/Admin"
import { html } from "htm/react"
import NewProposal from "../admin/NewProposal"
import AlternativePg from "../alternative/AlternativePg"
import Profile from "../profile/Profile"
import "./content.css"
import { ToastContainer } from "react-toastify"
import ErrorBoundary from "../../commonComponents/errorBoundary/ErrorBoundary"


const Content: React.FunctionComponent = () => {
    return html`
        <${ErrorBoundary}>
            <${BrowserRouter} basename="/sv">
                <div class="browserRouter">
                    <${Routes}>
                        <${Route} exact="true" path=${`${PATHS["snippet"].url}`} element=${html`<${SnippetPg} />`} />
                        <${Route} exact="true" path=${PATHS["alternative"].url} element=${html`<${AlternativePg} />`} />
                        <${Route} exact="true" path=${PATHS["admin"].url} element=${html`<${Admin} />`} />
                        <${Route} exact="true" path=${PATHS["profile"].url} element=${html`<${Profile} />`} />
                        <${Route} path="/" element=${html`<${SnippetPg} />`} />
                    <//>
                </div>
                <${ToastContainer} autoClose=${2000} hideProgressBar />
            <//>
        <//>
    `
}

export default Content
