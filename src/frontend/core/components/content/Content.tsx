import React from "react"
import  { Routes, Route, HashRouter, } from "react-router-dom"
import PATHS from "../../Path"
import SnippetPg from "../snippet/SnippetPg"
import Admin from "../admin/Admin"
import AlternativePg from "../alternative/AlternativePg"
import Profile from "../profile/Profile"
import "./content.css"
import { ToastContainer } from "react-toastify"
import ErrorBoundary from "../../commonComponents/errorBoundary/ErrorBoundary"
import TermsOfService from "../termsOfService/termsOfService"
import { NavLink } from "react-router-dom"


const Content: React.FunctionComponent = () => {
    return <>
        <ErrorBoundary>
            <HashRouter>
                <div className="browserRouter">
                    <Routes>
                        <Route path={PATHS["snippet"].url} element={<SnippetPg />} />
                        <Route path={PATHS["alternative"].url} element={<AlternativePg />} />
                        <Route path={PATHS["admin"].url} element={<Admin />} />
                        <Route path={PATHS["profile"].url} element={<Profile />} />
                        <Route path={PATHS["termsOfService"].url} element={<TermsOfService />} />
                    </Routes>
                </div>
                <div className="contentFooter">SnippetVault by <a href="https://www.sozonov.tech">Egor Sozonov</a>. This website uses cookies for identification of signed in users.
                By using this site you are agreeing to our <NavLink to={PATHS["termsOfService"].url} title="Terms of Service">Terms of Service</NavLink> and cookie policy.</div>
            </HashRouter>
        </ErrorBoundary>

        <ToastContainer autoClose={2000} hideProgressBar />
    </>
}
export default Content
