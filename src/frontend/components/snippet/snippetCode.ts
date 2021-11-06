import './snippet.css'
import { html } from 'htm/react'
import { NavLink } from 'react-router-dom';
import PATHS from '../../params/Path';


type Props = {
    content: string,
    isRight: boolean,
}

function copyTextToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}



function SnippetCode({content, isRight, } : Props) {
    const snippetContent = html`
        <pre class="snippetCode">
            ${content}
        </pre>
        `
    const alternativesLink = html`
        <${NavLink} exact to=${PATHS["alternative"].url}>
            <div title="Alternative versions" class="commentButton">
                A
            </div>
        <//>    
    `        
    return html`
        ${isRight === true
            ? html`
                <div class="snippetContentContainer">
                    <div class="snippetButtons">                        
                        ${alternativesLink}
                        <div class="commentButton" title="Copy code to clipboard" onClick=${() => copyTextToClipboard(content)}>C</div>
                    </div>
                    ${snippetContent}
                </div>
            `
            : html`<div class="snippetContentContainer">
                    ${snippetContent}
                    <div class="snippetButtons snippetButtonsRight">
                        ${alternativesLink}
                        <div class="commentButton" title="Copy code to clipboard" onClick=${() => copyTextToClipboard(content)}>C</div>
                    </div>
                </div>
            `
        }
    `
}

export default SnippetCode