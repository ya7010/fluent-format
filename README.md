# fluent-format

A CLI tool to format [Fluent](https://projectfluent.org/) (`.ftl`) files using the official `@fluent/syntax` parser.

## Features

- Format single `.ftl` files or entire directories recursively
- Check if files are properly formatted (useful for CI/CD)
- Write formatted output back to files or print to stdout
- Built with [Bun](https://bun.sh) for speed

## Installation

```bash
bun install
```

## Usage

### Format and print to stdout

```bash
bun run cli.ts <file-or-directory>
```

### Format and write to file

```bash
bun run cli.ts --write <file-or-directory>
# or
bun run cli.ts -w <file-or-directory>
```

### Check if files are formatted

```bash
bun run cli.ts --check <file-or-directory>
# or
bun run cli.ts -c <file-or-directory>
```

This will exit with code 1 if any files need formatting, making it perfect for CI/CD pipelines.

## Examples

```bash
# Format a single file and print to stdout
bun run cli.ts example.ftl

# Format a single file and write changes
bun run cli.ts --write example.ftl

# Format all .ftl files in a directory
bun run cli.ts --write ./locales

# Check if files are formatted (for CI)
bun run cli.ts --check ./locales
```

## Install globally

```bash
bun link
```

Then you can use it anywhere:

```bash
fluent-format --write my-file.ftl
```

## How it works

This tool uses the official `@fluent/syntax` parser to:
1. Parse `.ftl` files into an AST (Abstract Syntax Tree)
2. Serialize the AST back to properly formatted Fluent syntax
3. Ensure consistent formatting across all your Fluent translation files
