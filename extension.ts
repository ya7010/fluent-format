import * as vscode from 'vscode';
import { formatFluentContent } from './formatter';

export function activate(context: vscode.ExtensionContext) {
  console.log('Fluent Format extension is now active');

  // Register format command
  const formatCommand = vscode.commands.registerCommand(
    'fluent-format.format',
    async () => {
      await formatDocument(false);
    }
  );

  // Register format and sort command
  const formatSortCommand = vscode.commands.registerCommand(
    'fluent-format.formatSort',
    async () => {
      await formatDocument(true);
    }
  );

  // Register document formatter provider
  const formatterProvider = vscode.languages.registerDocumentFormattingEditProvider(
    { scheme: 'file', language: 'fluent' },
    {
      provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        const config = vscode.workspace.getConfiguration('fluentFormat');
        const sortOnFormat = config.get<boolean>('sortOnFormat', false);

        try {
          const content = document.getText();
          const formatted = formatFluentContent(content, { sort: sortOnFormat });

          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(content.length)
          );

          return [vscode.TextEdit.replace(fullRange, formatted)];
        } catch (error) {
          vscode.window.showErrorMessage(
            `Fluent Format Error: ${error instanceof Error ? error.message : String(error)}`
          );
          return [];
        }
      }
    }
  );

  // Format on save
  const formatOnSave = vscode.workspace.onWillSaveTextDocument((event) => {
    const config = vscode.workspace.getConfiguration('fluentFormat');
    const formatOnSaveEnabled = config.get<boolean>('formatOnSave', false);

    if (formatOnSaveEnabled && event.document.languageId === 'fluent') {
      const sortOnFormat = config.get<boolean>('sortOnFormat', false);
      event.waitUntil(formatDocumentPromise(event.document, sortOnFormat));
    }
  });

  context.subscriptions.push(
    formatCommand,
    formatSortCommand,
    formatterProvider,
    formatOnSave
  );
}

async function formatDocument(sort: boolean): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  if (editor.document.languageId !== 'fluent') {
    vscode.window.showErrorMessage('Current file is not a Fluent (.ftl) file');
    return;
  }

  try {
    const document = editor.document;
    const content = document.getText();
    const formatted = formatFluentContent(content, { sort });

    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(content.length)
    );

    await editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, formatted);
    });

    vscode.window.showInformationMessage(
      sort ? 'Fluent file formatted and sorted' : 'Fluent file formatted'
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Fluent Format Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

async function formatDocumentPromise(
  document: vscode.TextDocument,
  sort: boolean
): Promise<vscode.TextEdit[]> {
  try {
    const content = document.getText();
    const formatted = formatFluentContent(content, { sort });

    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(content.length)
    );

    return [vscode.TextEdit.replace(fullRange, formatted)];
  } catch (error) {
    console.error('Format error:', error);
    return [];
  }
}

export function deactivate() {}
