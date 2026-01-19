import { useState } from 'react';
import {
  deduplicateList,
  type DeduplicateOptions,
} from '../../lib/tools/deduplicate-list';

export default function DeduplicateList() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleDeduplicate = () => {
    const options: DeduplicateOptions = { caseSensitive };
    setOutput(deduplicateList(input, options));
    setHasRun(true);
  };

  const handleCopy = async () => {
    if (!hasRun || output.length === 0) {
      return;
    }

    await navigator.clipboard.writeText(output.join('\n'));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const formattedOutput = hasRun
    ? output.length === 0
      ? 'No items to show.'
      : output.join('\n')
    : 'Run deduplicate to see results.';

  const inputTotal = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length;
  const uniqueTotal = hasRun ? output.length : 0;

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-100">
      <div className="pointer-events-none absolute -left-32 top-[-240px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-200px] top-40 h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[140px]" />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <a
          className="text-sm font-semibold text-slate-300 hover:text-white"
          href="/"
        >
          ← Back to home
        </a>
        <div className="text-sm text-slate-400">Deduplicate List</div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold text-white">
            Remove duplicate entries in one click.
          </h1>
          <p className="text-base text-slate-300">
            Paste a list below and keep only unique values. The original order
            is preserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input
                className="h-4 w-4 accent-cyan-400"
                type="checkbox"
                checked={caseSensitive}
                onChange={(event) => setCaseSensitive(event.target.checked)}
              />
              Case sensitive
            </label>
            <button
              className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300"
              type="button"
              onClick={handleDeduplicate}
            >
              Remove duplicates
            </button>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-300">Input list</div>
            <div className="text-xs text-slate-500">Total: {inputTotal}</div>
            <textarea
              className="min-h-[260px] max-h-[360px] w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 outline-none ring-0 focus:border-cyan-500/60"
              placeholder="Paste items here, one per line"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
          </div>
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-300">
              Unique values
            </div>
            <div className="text-xs text-slate-500">Total: {uniqueTotal}</div>
            <textarea
              className="min-h-[260px] max-h-[360px] w-full resize-none overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-cyan-200 outline-none"
              value={formattedOutput}
              readOnly
            />
            <button
              className="inline-flex rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={handleCopy}
              disabled={!hasRun || output.length === 0}
            >
              {copied ? 'Copied' : 'Copy results'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
