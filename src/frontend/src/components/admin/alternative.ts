import Toggler from '../../commonComponents/toggler/toggler';
import HeaderRightButton from '../../commonComponents/headerRightButton/headerRightButton';
import Snippet from '../../types/snippet';
import "../snippet/snippet.css"
import { html } from 'htm/react'


const mockAlternatives: Snippet[] = [
    {
        leftCode: "str3 = str1.replace(str2, \"bcjk\");", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 1, taskName: "Replace substring", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "    if (it is FileInfo) {\n"
            + "        fNames[i, 0] = it.Name;\n"
            + "        fNames[i, 1] = dirInfo.FullName;\n"
            + "        fDates[i, 0] = it.LastWriteTime;\n"
            + "    }\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 2, taskName: "Get last modified times", 
    },
    {
        leftCode: "str3 = str1.replace(str2, \"bcjk\");", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 3, taskName: "Index of first occurrence of substring", 
    },
    {
        leftCode: "int index = str.LastIndexOf(\"bz\");", leftId: 1,
        rightCode: "", rightId: 2, 
        taskId: 4, taskName: "Index of last occurrence of substring", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "if (it is FileInfo) {\n"
            + "fNames[i, 0] = it.Name;\n"
            + "fNames[i, 1] = dirInfo.FullName;\n"
            + "fDates[i, 0] = it.LastWriteTime;\n"
            + "}\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 5, taskName: "Get last modified times", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "if (it is FileInfo) {\n"
            + "fNames[i, 0] = it.Name;\n"
            + "fNames[i, 1] = dirInfo.FullName;\n"
            + "fDates[i, 0] = it.LastWriteTime;\n"
            + "}\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 6, taskName: "Get last modified times", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "if (it is FileInfo) {\n"
            + "fNames[i, 0] = it.Name;\n"
            + "fNames[i, 1] = dirInfo.FullName;\n"
            + "fDates[i, 0] = it.LastWriteTime;\n"
            + "}\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 7, taskName: "Get last modified times", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "if (it is FileInfo) {\n"
            + "fNames[i, 0] = it.Name;\n"
            + "fNames[i, 1] = dirInfo.FullName;\n"
            + "fDates[i, 0] = it.LastWriteTime;\n"
            + "}\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 8, taskName: "Get last modified times", 
    },
    {
        leftCode: "DirectoryInfo dirInfo = new DirectoryInfo(thePath);\n"
            + "fInfos = dirInfo.GetFileSystemInfos(\"*.CSV\");\n"
            + "foreach (FileSystemInfo it in fInfos) {\n"
            + "if (it is FileInfo) {\n"
            + "fNames[i, 0] = it.Name;\n"
            + "fNames[i, 1] = dirInfo.FullName;\n"
            + "fDates[i, 0] = it.LastWriteTime;\n"
            + "}\n"
            + "}", leftId: 1,
        rightCode: "str3 = str1.replacingOccurrences(of: str2, with: \"bcjk\")", rightId: 2, 
        taskId: 9, taskName: "Get last modified times", 
    },
]

function Alternative() {
    return html`
        <div class="adminAlternative">
            
            <div class="snippetsContainer">
                <div class="snippetsHeader">
                    <div class="snippetLeftHeader">
                        Alternatives
                    </div>
                    <div class="taskForHeader"><Toggler leftChoice="Old->new" rightChoice="Highest votes first" initChosen={false}>
                                </Toggler></div>
                    <div class="snippetRightHeader">
                        &nbsp;
                    </div>
                </div>
                ${mockAlternatives.map((snippet: Snippet, idx: number ) => {
                    const evenClass = (idx%2 === 0 ? " evenRow" : "")
                    return html`
                        <div class="snippetContainer" key={idx}>
                            <div class=${"snippet leftSide" + evenClass}>${snippet.leftCode}</div>
                            <div class=${"taskContainer" + evenClass}>
                                <div class="taskLeft">
                                </div>
                                <div class="task">${snippet.taskName}</div>
                                <div class="taskRight commentButton" title="Promote to main version">
                                    P
                                </div>
                            </div>
                            <div class=${"snippet rightSide" + evenClass}>${snippet.rightCode}</div>
                        </div>
                        `
                })}
                
            </div>

        </div>
    `
}

export default Alternative