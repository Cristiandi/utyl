import { useState } from 'react';
import {
  compareLists,
  normalizeList,
  type CompareResults,
} from '../../lib/tools/compare-lists';

function formatList(items: string[], hasCompared: boolean) {
  if (!hasCompared) {
    return 'Run compare to see results.';
  }

  return items.length === 0 ? 'No matches found.' : items.join('\n');
}

export default function CompareLists() {
  const [listA, setListA] = useState('');
  const [listB, setListB] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [hasCompared, setHasCompared] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [results, setResults] = useState<CompareResults>({
    inBoth: [],
    onlyA: [],
    onlyB: [],
  });

  const handleCompare = () => {
    const normalizedA = normalizeList(listA, caseSensitive);
    const normalizedB = normalizeList(listB, caseSensitive);
    setResults(compareLists(normalizedA, normalizedB));
    setHasCompared(true);
  };

  const handleCopy = async (key: string, items: string[]) => {
    if (!hasCompared || items.length === 0) {
      return;
    }

    await navigator.clipboard.writeText(items.join('\n'));
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1500);
  };

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
        <div className="text-sm text-slate-400">Compare Lists</div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold text-white">
            Compare two lists instantly.
          </h1>
          <p className="text-base text-slate-300">
            Paste two lists below and see what matches, what is unique to each,
            and how many items are shared.
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
              onClick={handleCompare}
            >
              Compare lists
            </button>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-300">List A</div>
            <textarea
              className="min-h-[220px] w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 outline-none ring-0 focus:border-cyan-500/60"
              placeholder="Paste list A, one item per line"
              value={listA}
              onChange={(event) => setListA(event.target.value)}
            />
          </div>
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-300">List B</div>
            <textarea
              className="min-h-[220px] w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 outline-none ring-0 focus:border-cyan-500/60"
              placeholder="Paste list B, one item per line"
              value={listB}
              onChange={(event) => setListB(event.target.value)}
            />
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="text-sm font-semibold text-slate-200">
              In both lists
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {results.inBoth.length} matches
            </p>
            <textarea
              className="mt-4 min-h-[160px] w-full resize-none overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-cyan-200 outline-none"
              value={formatList(results.inBoth, hasCompared)}
              readOnly
            />
            <button
              className="mt-3 inline-flex rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={() => handleCopy('both', results.inBoth)}
              disabled={!hasCompared || results.inBoth.length === 0}
            >
              {copiedKey === 'both' ? 'Copied' : 'Copy results'}
            </button>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="text-sm font-semibold text-slate-200">
              Only in A
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {results.onlyA.length} unique
            </p>
            <textarea
              className="mt-4 min-h-[160px] w-full resize-none overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200 outline-none"
              value={formatList(results.onlyA, hasCompared)}
              readOnly
            />
            <button
              className="mt-3 inline-flex rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={() => handleCopy('onlyA', results.onlyA)}
              disabled={!hasCompared || results.onlyA.length === 0}
            >
              {copiedKey === 'onlyA' ? 'Copied' : 'Copy results'}
            </button>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="text-sm font-semibold text-slate-200">
              Only in B
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {results.onlyB.length} unique
            </p>
            <textarea
              className="mt-4 min-h-[160px] w-full resize-none overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200 outline-none"
              value={formatList(results.onlyB, hasCompared)}
              readOnly
            />
            <button
              className="mt-3 inline-flex rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={() => handleCopy('onlyB', results.onlyB)}
              disabled={!hasCompared || results.onlyB.length === 0}
            >
              {copiedKey === 'onlyB' ? 'Copied' : 'Copy results'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
