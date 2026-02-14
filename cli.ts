#!/usr/bin/env bun

import { Command } from 'commander';
import { formatFile, formatDirectory } from './formatter';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const program = new Command();

program
  .name('fluent-format')
  .description('A CLI tool to format Fluent (.ftl) files')
  .version('0.1.0')
  .argument('<path>', 'File or directory to format')
  .option('-w, --write', 'Write formatted output to file', false)
  .option('-c, --check', 'Check if files are formatted (exit with error if not)', false)
  .action(async (path: string, options: { write: boolean; check: boolean }) => {
    const targetPath = join(process.cwd(), path);

    if (!existsSync(targetPath)) {
      console.error(`Error: Path not found: ${targetPath}`);
      process.exit(1);
    }

    const stats = statSync(targetPath);

    try {
      if (stats.isFile()) {
        if (!path.endsWith('.ftl')) {
          console.error('Error: Only .ftl files are supported');
          process.exit(1);
        }

        const result = await formatFile(targetPath, options.write);

        if (options.check) {
          if (!result.isFormatted) {
            console.error(`✗ ${path} needs formatting`);
            process.exit(1);
          } else {
            console.log(`✓ ${path} is formatted`);
          }
        } else if (options.write) {
          console.log(`✓ Formatted ${path}`);
        } else {
          console.log(result.content);
        }
      } else if (stats.isDirectory()) {
        const results = await formatDirectory(targetPath, options.write);

        if (options.check) {
          const unformatted = results.filter(r => !r.isFormatted);
          if (unformatted.length > 0) {
            unformatted.forEach(r => console.error(`✗ ${r.path} needs formatting`));
            process.exit(1);
          } else {
            console.log(`✓ All ${results.length} files are formatted`);
          }
        } else {
          results.forEach(r => {
            if (options.write) {
              console.log(`✓ Formatted ${r.path}`);
            }
          });
          if (!options.write) {
            console.log(`Found ${results.length} .ftl files`);
          }
        }
      }
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

program.parse();
