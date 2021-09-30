import React from "react"
import  { BrowserRouter, Switch, Route } from "react-router-dom"
import PATHS from "./path"
import SnippetPg from "./components/snippet/snippetPg"
import Admin from "./components/admin/admin"
import Group from "./components/group/group"


const Content: React.FunctionComponent = () => {
    console.log("Content render")
    return (
    <BrowserRouter>
        <div style={{backgroundColor: "#303030", scrollbarWidth: "thin"}}>
            <Switch>
                <Route exact={true} path={PATHS["snippet"].url}>
                    <SnippetPg />
                </Route>
                <Route exact={true} path={PATHS["group"].url}>
                    <Group />
                </Route>
                <Route exact={true} path={PATHS["admin"].url}>
                    <Admin />
                </Route>
          </Switch>
        </div>
    </BrowserRouter>)
}

export default Content