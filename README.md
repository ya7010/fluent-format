# fluent-format

A CLI tool to format [Fluent](https://projectfluent.org/) (`.ftl`) files using the official `@fluent/syntax` parser.

## Features

- Format single `.ftl` files or entire directories recursively
- Sort messages alphabetically within blank-line-separated groups
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

### Sort messages alphabetically

```bash
bun run cli.ts --sort <file-or-directory>
# or
bun run cli.ts -s <file-or-directory>

# Combine with --write to save sorted output
bun run cli.ts --sort --write <file-or-directory>
```

The sort feature groups messages by blank lines. Within each group, messages are sorted alphabetically by their ID. Group comments (comments at the start of a group) are preserved and attached to the first message after sorting.

## Examples

```bash
# Format a single file and print to stdout
bun run cli.ts example.ftl

# Format a single file and write changes
bun run cli.ts --write example.ftl

# Sort and format a file
bun run cli.ts --sort --write example.ftl

# Format all .ftl files in a directory
bun run cli.ts --write ./locales

# Sort all .ftl files in a directory
bun run cli.ts --sort --write ./locales

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
2. Optionally sort messages alphabetically within groups (separated by blank lines)
3. Serialize the AST back to properly formatted Fluent syntax
4. Ensure consistent formatting across all your Fluent translation files

### Sorting behavior

When using the `--sort` option:
- Messages are grouped by blank lines in the original file
- Within each group, messages are sorted alphabetically by their ID
- Comments at the beginning of a group are preserved and remain at the top of that group
- Blank lines between groups are maintained

Example:

**Before sorting:**
```fluent
# Authentication
logout = Log out
login = Log in
signup = Sign up

# Settings
theme = Theme
language = Language
```

**After sorting:**
```fluent
# Authentication
login = Log in
logout = Log out
signup = Sign up

# Settings
language = Language
theme = Theme
```
