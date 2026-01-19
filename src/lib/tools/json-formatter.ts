export type FormatJsonOptions = {
  minify: boolean;
};

export function formatJson(input: string, options: FormatJsonOptions) {
  const parsed = JSON.parse(input);
  return options.minify
    ? JSON.stringify(parsed)
    : JSON.stringify(parsed, null, 2);
}

export function tryFixJson(input: string) {
  let text = input.trim();

  text = text.replace(/,\s*([}\]])/g, '$1');
  text = text.replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":');
  text = text.replace(
    /'([^'\\]*(?:\\.[^'\\]*)*)'/g,
    (_, value: string) => `"${value.replace(/"/g, '\\"')}"`
  );

  JSON.parse(text);
  return text;
}
