# Change Log

## [0.1.0] - 2026-02-14

### Added
- Initial release
- CLI tool to format Fluent (.ftl) files
  - Sort messages alphabetically within blank-line-separated groups
  - Format checking for CI/CD (`--check` option)
  - Library API for programmatic use
- VSCode extension (separate package in `vscode-extension/`)
  - Document formatting provider
  - Format on save support
  - Commands for format and format+sort
  - Configuration options for sort and format on save
  - Language configuration for Fluent files
    - Syntax highlighting support
    - Auto-closing pairs
    - Comment toggling

### Changed
- Separated CLI tool and VSCode extension into distinct packages
- VSCode extension now depends on fluent-format as a library
- Moved source files to `src/` directory
- Simplified VSCode extension to use standard VSCode formatting API
  - Removed custom commands (`fluent-format.format`, `fluent-format.formatSort`)
  - Removed `fluentFormat.formatOnSave` setting (use standard `editor.formatOnSave`)
  - Kept `fluentFormat.sortOnFormat` setting for sort behavior control
