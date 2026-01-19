export type DeduplicateOptions = {
  caseSensitive: boolean;
};

export function deduplicateList(
  raw: string,
  options: DeduplicateOptions
): string[] {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const output: string[] = [];

  for (const line of lines) {
    const key = options.caseSensitive ? line : line.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(line);
  }

  return output;
}
