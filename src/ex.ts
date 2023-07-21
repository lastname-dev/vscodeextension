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
                // Get the current configuration
                const configuration = vscode.workspace.getConfiguration();

                // Get the existing colorCustomizations
                let colorCustomizations =
                    configuration.get(
                        "editor.tokenColorCustomizations.colorCustomizations"
                    ) || {};

                // Add or update the color customization for the specified scope
                colorCustomizations = {
                    ...colorCustomizations,
                    [scope]: color,
                };

                // Update the configuration with the new colorCustomizations
                configuration.update(
                    "editor.tokenColorCustomizations",
                    { colorCustomizations },
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
