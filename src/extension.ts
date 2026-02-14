// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "kitaapi" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const activateAura = vscode.commands.registerCommand('kitaapi.helloWorld', () => {
		const panel = vscode.window.createWebviewPanel(
			'kitaImage',
			'Kita!',
			vscode.ViewColumn.One, 
			{
				enableScripts: true, // Allow JavaScript if needed
				enableCommandUris: true
				
			}

		);
		panel.webview.html = getWebviewContent();
		vscode.window.showInformationMessage('KitaAPI launched!');
		const disposable = vscode.workspace.onDidChangeTextDocument(event => {
		if (vscode.window.activeTextEditor?.document === event.document) {
			panel.webview.postMessage({
				lines: event.document.lineCount
			});
		}
		panel.onDidDispose(() => {
			disposable.dispose();
		});

	});
	});
	
	
	context.subscriptions.push(activateAura);
}

function getWebviewContent(){
	return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data: blob:; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src https:;">
    <style>
        html, body{
            height: 100%;
            margin: 0;
            background-color: #fba7a7;
            overflow:hidden;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
        }
        #kitaImage{
            max-width: 90%;
            max-height: 90vh;
            object-fit: contain;
            border-color: #bb4840;
            border-style: solid;
            border-width: 3px;
        }
    </style>
</head>
<body>
    <div>
        <img id="kitaImage" src="https://cdn.donmai.us/sample/21/0a/__kita_ikuyo_bocchi_the_rock_drawn_by_mayo_oekaki_bibbi__sample-210a8bcd36793527dfd2e2202abe2605.jpg">
    </div>
    <a id="kitaSource" href="adasdsadas">Source: </a>
    <script>
        let kitaImage = document.getElementById("kitaImage");
        let url = "https://danbooru.donmai.us/posts.json?tags=kita_ikuyo+rating:safe&limit=1&random=true";
        let kitaSource = document.getElementById("kitaSource");
        function changeKitaImage(){
            fetch(url)
            .then(response => response.json())
            .then(data => {
                let variants = data[0].media_asset.variants;
                let artist = data[0].tag_string_artist;
                let newurl = variants?.[1]?.url || variants?.[0]?.url || data[0].file_url;
				if(newurl?.startsWith("//")) newurl = "https:" + newurl;
                let source = data[0].source;
                kitaImage.src = newurl;
                kitaSource.href = newurl;
                kitaSource.innerText = artist;
			});
        }

        changeKitaImage();
		let lastLineCount = 0;
        window.addEventListener('message', event => {
            const data = event.data;
            if(data.lines % 10 === 0 && data.lines !== lastLineCount){
				lastLineCount = data.lines;
                changeKitaImage();
            }
        });
    </script>
</body>
</html>
	
	
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
