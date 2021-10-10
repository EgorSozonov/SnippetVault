import './snippet.css'
import { html } from 'htm/react'


type Props = {
    content: string,
    isRight: boolean,
}

function SnippetCode({content, isRight, } : Props) {
    const snippetContent = html`
        <pre class="snippetCode">
            {content}
        </pre>
        `
    return html`
        ${isRight 
            ? html`<div class="snippetContentContainer">
                    <div class="snippetButtons">
                        <div class="commentButton" title="Alternative versions">A</div>
                        <div class="commentButton" title="Copy text">C</div>
                    </div>
                    ${snippetContent}
                </div>
            `
            : html`<div class="snippetContentContainer">
                    ${snippetContent}
                    <div class="snippetButtons snippetButtonsRight">
                        <div class="commentButton" title="Alternative versions">A</div>
                        <div class="commentButton" title="Copy text">C</div>
                    </div>
                </div>
            `
        }
    `
}

export default SnippetCode