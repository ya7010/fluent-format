import {
  parse,
  Resource,
  serialize,
  Entry,
  Message,
  Term,
  lineOffset,
} from "@fluent/syntax";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

export interface FormatResult {
  path: string;
  content: string;
  isFormatted: boolean;
}

export interface FormatOptions {
  sort?: boolean;
}

function getEntryId(entry: Entry): string | null {
  if (entry.type === "Message") {
    return (entry as Message).id.name;
  }
  if (entry.type === "Term") {
    return (entry as Term).id.name;
  }
  return null;
}

function groupEntriesByBlankLines(
  content: string,
  entries: Entry[],
): Entry[][] {
  if (entries.length === 0) return [];

  const lines = content.split("\n");
  const groups: Entry[][] = [];
  let currentGroup: Entry[] = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const nextEntry = entries[i + 1];

    currentGroup.push(entry);

    // Check if there's a blank line between this entry and the next one
    if (nextEntry && entry.span && nextEntry.span) {
      const currentEndLine = lineOffset(content, entry.span.end);
      const nextStartLine = lineOffset(content, nextEntry.span.start);

      // Check if there's a blank line in between
      let hasBlankLine = false;
      for (
        let lineNum = currentEndLine + 1;
        lineNum < nextStartLine;
        lineNum++
      ) {
        if (lineNum < lines.length && lines[lineNum].trim() === "") {
          hasBlankLine = true;
          break;
        }
      }

      if (hasBlankLine) {
        groups.push(currentGroup);
        currentGroup = [];
      }
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

interface EntryUnit {
  leadingComments: Entry[];
  entry: Entry | null;
}

function createEntryUnits(entries: Entry[]): EntryUnit[] {
  const units: EntryUnit[] = [];
  let leadingComments: Entry[] = [];

  for (const entry of entries) {
    const entryId = getEntryId(entry);

    if (!entryId) {
      // This is a comment or other non-message/term entry
      leadingComments.push(entry);
    } else {
      // This is a message or term
      units.push({
        leadingComments: [...leadingComments],
        entry,
      });
      leadingComments = [];
    }
  }

  // Handle any trailing comments
  if (leadingComments.length > 0) {
    units.push({
      leadingComments,
      entry: null,
    });
  }

  return units;
}

function sortEntriesInGroups(content: string, entries: Entry[]): Entry[] {
  const groups = groupEntriesByBlankLines(content, entries);
  const sortedEntries: Entry[] = [];

  for (const group of groups) {
    if (group.length === 0) continue;

    // Find and extract group comment from any entry
    let groupComment = null;
    for (const entry of group) {
      if (
        (entry.type === "Message" || entry.type === "Term") &&
        (entry as any).comment
      ) {
        groupComment = (entry as any).comment;
        (entry as any).comment = null; // Remove comment from original entry
        break;
      }
    }

    // Sort all entries in the group by their ID
    const sorted = [...group].sort((a, b) => {
      const idA = getEntryId(a);
      const idB = getEntryId(b);

      if (!idA && !idB) return 0;
      if (!idA) return 1;
      if (!idB) return -1;

      return idA.localeCompare(idB);
    });

    // Attach group comment to the first entry
    if (groupComment && sorted.length > 0) {
      const firstEntry = sorted[0] as any;
      if (firstEntry.type === "Message" || firstEntry.type === "Term") {
        firstEntry.comment = groupComment;
      }
    }

    sortedEntries.push(...sorted);
  }

  return sortedEntries;
}

export function formatFluentContent(
  content: string,
  options: FormatOptions = {},
): string {
  try {
    const resource: Resource = parse(content, { withSpans: true });

    if (options.sort) {
      resource.body = sortEntriesInGroups(content, resource.body);
    }

    return serialize(resource, { withJunk: true });
  } catch (error) {
    throw new Error(
      `Failed to parse Fluent content: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function formatFile(
  filePath: string,
  write: boolean = false,
  options: FormatOptions = {},
): Promise<FormatResult> {
  const content = readFileSync(filePath, "utf-8");
  const formatted = formatFluentContent(content, options);
  const isFormatted = content === formatted;

  if (write && !isFormatted) {
    writeFileSync(filePath, formatted, "utf-8");
  }

  return {
    path: filePath,
    content: formatted,
    isFormatted,
  };
}

export async function formatDirectory(
  dirPath: string,
  write: boolean = false,
  options: FormatOptions = {},
): Promise<FormatResult[]> {
  const results: FormatResult[] = [];

  async function walk(dir: string) {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        await walk(fullPath);
      } else if (stats.isFile() && entry.endsWith(".ftl")) {
        const result = await formatFile(fullPath, write, options);
        results.push(result);
      }
    }
  }

  await walk(dirPath);
  return results;
}
