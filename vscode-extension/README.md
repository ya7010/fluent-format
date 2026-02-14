# Fluent Format - VSCode Extension

Format and sort [Fluent](https://projectfluent.org/) (`.ftl`) translation files directly in VSCode.

## Features

- **Document Formatter**: Integrates with VSCode's standard formatting system
- **Sort Messages**: Optionally sort messages alphabetically within groups (separated by blank lines)
- **Format on Save**: Use VSCode's standard `editor.formatOnSave` setting

## Usage

### Format a File

1. Open a `.ftl` file
2. Right-click and select "Format Document" or press `Shift+Alt+F`
3. The file will be formatted according to your settings

### Format on Save

Enable format-on-save using VSCode's standard setting:

```json
{
  "[fluent]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "fluent-format.vscode-fluent-format"
  }
}
```

### Settings

Configure sorting behavior:

```json
{
  "fluentFormat.sortOnFormat": false
}
```

**Options:**
- `fluentFormat.sortOnFormat` (default: `false`): Sort messages alphabetically when formatting

## Sorting Behavior

When sorting is enabled:
- Messages are grouped by blank lines
- Within each group, messages are sorted alphabetically by ID
- Comments at the beginning of a group are preserved

## Example

**Before:**
```fluent
# Authentication
logout = Log out
login = Log in
signup = Sign up
```

**After formatting with sort:**
```fluent
# Authentication
login = Log in
logout = Log out
signup = Sign up
```

## Requirements

This extension uses the [fluent-format](https://www.npmjs.com/package/fluent-format) package for formatting.

## License

MIT
