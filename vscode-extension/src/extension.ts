import * as vscode from "vscode";
import { formatFluentContent } from "fluent-format";

export function activate(context: vscode.ExtensionContext) {
  console.log("Fluent Format extension is now active");

  // Register document formatter provider
  const formatterProvider =
    vscode.languages.registerDocumentFormattingEditProvider(
      { scheme: "file", language: "fluent" },
      {
        provideDocumentFormattingEdits(
          document: vscode.TextDocument,
        ): vscode.TextEdit[] {
          const config = vscode.workspace.getConfiguration("fluentFormat");
          const sortOnFormat = config.get<boolean>("sortOnFormat", false);

          try {
            const content = document.getText();
            const formatted = formatFluentContent(content, {
              sort: sortOnFormat,
            });

            const fullRange = new vscode.Range(
              document.positionAt(0),
              document.positionAt(content.length),
            );

            return [vscode.TextEdit.replace(fullRange, formatted)];
          } catch (error) {
            vscode.window.showErrorMessage(
              `Fluent Format Error: ${error instanceof Error ? error.message : String(error)}`,
            );
            return [];
          }
        },
      },
    );

  context.subscriptions.push(formatterProvider);
}

export function deactivate() {}
