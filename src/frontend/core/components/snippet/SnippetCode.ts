import "./snippet.css"
import { html } from "htm/react"
import { NavLink } from "react-router-dom";
import PATHS from "../../Path";


type Props = {
    content: string,
    isRight: boolean,
    langId: number,
    libraries?: string,
    tlId: number,
}

function copyTextToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}

function SnippetCode({content, isRight, langId, libraries, tlId, } : Props) {
    const snippetContent = html`

        <div>
            <pre class="snippetCode">
                ${content}
            </pre>
        </div>
        ${libraries &&
            html`
                <div>
                    Libraries:
                    <pre class="snippetCode">
                        ${libraries}
                    </pre>
                </div>
            `
        }
    `
    const alternativesLink = html`
        <${NavLink} exact="true" to=${`${PATHS["alternative"].urlPrefix}/${langId}/${tlId}`}>
            <div title="Alternative versions" class="commentButton">
                A
            </div>
        <//>
    `
    return html`
        ${isRight === true
            ? html`

                    <div class="snippetButtons">
                        ${alternativesLink}
                        <div class="commentButton" title="Copy code to clipboard" onClick=${() => copyTextToClipboard(content)}>C</div>
                    </div>
                    <div class="snippetCodeLibraries">
                        ${snippetContent}
                    </div>

            `
            : html`
                    <div class="snippetCodeLibraries">
                        ${snippetContent}
                    </div>
                    <div class="snippetButtons snippetButtonsRight">
                        ${alternativesLink}
                        <div class="commentButton" title="Copy code to clipboard" onClick=${() => copyTextToClipboard(content)}>C</div>
                    </div>

            `
        }
    `
}

export default SnippetCode
