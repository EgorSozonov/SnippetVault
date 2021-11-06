import './snippet.css'
import { html } from 'htm/react'


type Props = {
    content: string,
    isRight: boolean,
}

function copyTextToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function SnippetCode({content, isRight, } : Props) {
    const snippetContent = html`
        <pre class="snippetCode">
            ${content}
        </pre>
        `
    return html`
        ${isRight === true
            ? html`
                <div class="snippetContentContainer">
                    <div class="snippetButtons">
                        <div class="commentButton" title="Alternative versions">A</div>
                        <div class="commentButton" title="Copy code to clipboard" onClick=${() => copyTextToClipboard(content)}>C</div>
                    </div>
                    ${snippetContent}
                </div>
            `
            : html`<div class="snippetContentContainer">
                    ${snippetContent}
                    <div class="snippetButtons snippetButtonsRight">
                        <div class="commentButton" title="Alternative versions">A</div>
                        <div class="commentButton" title="Copy code to clipboard" onClick=${() => copyTextToClipboard(content)}>C</div>
                    </div>
                </div>
            `
        }
    `
}

export default SnippetCode