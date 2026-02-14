# VSCode Extension Development

## Setup

1. Install dependencies:
   ```bash
   bun install
   ```

2. Compile the extension:
   ```bash
   bun run compile
   ```

## Testing the Extension

1. Open this folder in VSCode
2. Press `F5` to launch the Extension Development Host
3. In the new window, open or create a `.ftl` file
4. Test the following features:

### Manual Formatting

- Open Command Palette (`Cmd+Shift+P`)
- Run `Format Fluent File` to format the current file
- Run `Format and Sort Fluent File` to format and sort

### Format Document

- Right-click in a `.ftl` file
- Select "Format Document" or press `Shift+Alt+F`
- The file will be formatted according to your settings

### Format on Save

1. Open VSCode Settings (`Cmd+,`)
2. Search for "fluentFormat"
3. Enable "Format On Save"
4. Optionally enable "Sort On Format"
5. Save a `.ftl` file to see automatic formatting

## Configuration

Available settings:

- `fluentFormat.formatOnSave` (boolean): Automatically format Fluent files on save
- `fluentFormat.sortOnFormat` (boolean): Sort messages alphabetically when formatting

## Building for Production

To package the extension for distribution:

```bash
# Install vsce if you haven't already
npm install -g @vscode/vsce

# Package the extension
bun run package
```

This creates a `.vsix` file that can be:
- Installed locally: Extensions → Install from VSIX
- Published to the VSCode Marketplace
- Shared with others

## Project Structure

```
.
├── extension.ts              # Extension entry point
├── formatter.ts              # Core formatting logic
├── language-configuration.json  # Fluent language config
├── tsconfig.extension.json   # TypeScript config for extension
├── package.json              # Extension manifest
└── out/                      # Compiled output (git-ignored)
    ├── extension.js
    └── formatter.js
```

## Debugging

- Set breakpoints in `extension.ts` or `formatter.ts`
- Press `F5` to start debugging
- Breakpoints will be hit when you use the extension

## Common Issues

### Extension Not Loading

- Make sure you've run `bun run compile` first
- Check the Output panel (View → Output → Extension Host)

### Formatter Not Working

- Ensure the file has `.ftl` extension
- Check that the language ID is set to "fluent"
- Look for errors in the Developer Console (`Help → Toggle Developer Tools`)
