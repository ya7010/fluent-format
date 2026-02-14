# Project Structure

This repository contains two packages:

## 1. fluent-format (CLI Tool & Library)

The main CLI tool and library for formatting Fluent files.

**Location**: Root directory

**Usage**:
```bash
# As CLI
bun src/cli.ts --sort --write file.ftl

# As library (from other packages)
import { formatFluentContent } from 'fluent-format';
```

**Files**:
- `src/formatter.ts` - Core formatting logic
- `src/cli.ts` - CLI interface
- `src/index.ts` - Library exports
- `package.json` - Package configuration

## 2. vscode-fluent-format (VSCode Extension)

VSCode extension for formatting Fluent files in the editor.

**Location**: `vscode-extension/`

**Dependencies**: Depends on `fluent-format` (via `file:..`)

**Development**:
```bash
# Install dependencies
cd vscode-extension
bun install

# Compile
bun run compile

# Watch mode
bun run watch

# Package for distribution
bun run package
```

**Testing**:
1. Open `vscode-extension/` in VSCode
2. Press F5 to launch Extension Development Host
3. Test formatting in `.ftl` files

**Files**:
- `src/extension.ts` - Extension entry point
- `language-configuration.json` - Fluent language config
- `package.json` - Extension manifest
- `.vscode/` - VSCode debug/task configuration

## Why Separate?

- **Clear separation of concerns**: CLI tool vs editor integration
- **Independent versioning**: Each package can be published separately
- **Smaller bundle sizes**: VSCode extension only includes what it needs
- **Easier maintenance**: Changes to one don't affect the other

## Publishing

### CLI Tool
```bash
# From root directory
npm publish
```

### VSCode Extension
```bash
cd vscode-extension
vsce package
vsce publish
```
