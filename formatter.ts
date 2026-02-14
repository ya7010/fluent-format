import { parse, Resource, serialize } from '@fluent/syntax';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

export interface FormatResult {
  path: string;
  content: string;
  isFormatted: boolean;
}

export function formatFluentContent(content: string): string {
  try {
    const resource: Resource = parse(content);
    return serialize(resource, { withJunk: true });
  } catch (error) {
    throw new Error(`Failed to parse Fluent content: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function formatFile(filePath: string, write: boolean = false): Promise<FormatResult> {
  const content = readFileSync(filePath, 'utf-8');
  const formatted = formatFluentContent(content);
  const isFormatted = content === formatted;

  if (write && !isFormatted) {
    writeFileSync(filePath, formatted, 'utf-8');
  }

  return {
    path: filePath,
    content: formatted,
    isFormatted,
  };
}

export async function formatDirectory(dirPath: string, write: boolean = false): Promise<FormatResult[]> {
  const results: FormatResult[] = [];

  async function walk(dir: string) {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        await walk(fullPath);
      } else if (stats.isFile() && entry.endsWith('.ftl')) {
        const result = await formatFile(fullPath, write);
        results.push(result);
      }
    }
  }

  await walk(dirPath);
  return results;
}
