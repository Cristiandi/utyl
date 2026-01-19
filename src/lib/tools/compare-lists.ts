export type CompareResults = {
  inBoth: string[];
  onlyA: string[];
  onlyB: string[];
};

export function normalizeList(raw: string, caseSensitive: boolean) {
  const base = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (caseSensitive) {
    return base;
  }

  return base.map((line) => line.toLowerCase());
}

export function compareLists(
  listA: string[],
  listB: string[]
): CompareResults {
  const setA = new Set(listA);
  const setB = new Set(listB);

  const inBoth = listA.filter((item) => setB.has(item));
  const onlyA = listA.filter((item) => !setB.has(item));
  const onlyB = listB.filter((item) => !setA.has(item));

  return {
    inBoth: Array.from(new Set(inBoth)),
    onlyA: Array.from(new Set(onlyA)),
    onlyB: Array.from(new Set(onlyB)),
  };
}
