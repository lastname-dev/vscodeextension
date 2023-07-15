import { inspect } from "util";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        "extension.changeVariableColor",
        async () => {
            const scope = await vscode.window.showInputBox({
                prompt: "Enter the variable scope",
            });
            const color = await vscode.window.showInputBox({
                prompt: "Enter the desired color",
            });

            if (scope && color) {
                const configuration = vscode.workspace.getConfiguration();

                let colorCustomizations = configuration.get<{
                    textMateRules: any[];
                }>("editor.tokenColorCustomizations", { textMateRules: [] });
                console.log(inspect(colorCustomizations, { depth: null }));
                const textMateRules = colorCustomizations.textMateRules;

                // Add the new scope and color to textMateRules
                const newRule = {
                    scope: [scope],
                    settings: {
                        foreground: color,
                    },
                };

                textMateRules.push(newRule);

                // Update the colorCustomizations with the modified textMateRules
                configuration.update(
                    "editor.tokenColorCustomizations",
                    { textMateRules },
                    vscode.ConfigurationTarget.Global
                );

                // Show a success message
                vscode.window.showInformationMessage(
                    `Color customization added for scope "${scope}" with color "${color}".`
                );

                // Reload VS Code to apply the new color customization immediately
                vscode.commands.executeCommand("workbench.action.reloadWindow");
            }
        }
    );

    context.subscriptions.push(disposable);
}
