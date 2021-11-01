import React from 'react'
import { NavLink } from 'react-router-dom'
import PATHS from '../../params/Path'
import { html } from 'htm/react'


function LangGroup() {
    return html`
        <div>Hello world group
            <p>
                <${NavLink} to=${PATHS["admin"].url}>
                    <div class="adminHeader">Back to admin</div>
                <//>
            </p>
        </div>
    `
}

export default LangGroup