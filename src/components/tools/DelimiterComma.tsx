import { useState } from 'react';
import {
  formatDelimiterComma,
  type DelimiterStyle,
  type DelimiterOptions,
  type QuoteStyle,
  type SortStyle,
} from '../../lib/tools/delimiter-comma';

const quoteOptions: { label: string; value: QuoteStyle }[] = [
  { label: 'No quotes', value: 'none' },
  { label: 'Double', value: 'double' },
  { label: 'Single', value: 'single' },
];

const sortOptions: { label: string; value: SortStyle }[] = [
  { label: 'None', value: 'none' },
  { label: 'A → Z', value: 'asc' },
  { label: 'Z → A', value: 'desc' },
];

export default function DelimiterComma() {
  const [columnInput, setColumnInput] = useState('');
  const [delimitedInput, setDelimitedInput] = useState('');
  const [delimiter] = useState<DelimiterStyle>(',');
  const [customDelimiter, setCustomDelimiter] = useState('');
  const [quoteStyle, setQuoteStyle] = useState<QuoteStyle>('none');
  const [quoteOnlyIfNeeded, setQuoteOnlyIfNeeded] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [deduplicate, setDeduplicate] = useState(false);
  const [sort, setSort] = useState<SortStyle>('none');

  const options: DelimiterOptions = {
    delimiter,
    customDelimiter,
    quoteStyle,
    quoteOnlyIfNeeded,
    trimWhitespace,
    removeEmpty,
    deduplicate,
    sort,
  };

  const handleToDelimited = () => {
    setDelimitedInput(
      formatDelimiterComma(columnInput, 'toDelimited', options)
    );
  };

  const handleToColumn = () => {
    setColumnInput(
      formatDelimiterComma(delimitedInput, 'toColumn', options)
    );
  };

  const handleClear = () => {
    setColumnInput('');
    setDelimitedInput('');
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b0f14] text-slate-100">
      <div className="pointer-events-none absolute -left-32 top-[-240px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-200px] top-40 h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[140px]" />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <a
          className="text-sm font-semibold text-slate-300 hover:text-white"
          href="/"
        >
          ← Back to home
        </a>
        <div className="text-sm text-slate-400">Delimiter ↔ Comma</div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold text-white">
            Convert delimiters to commas (and back).
          </h1>
          <p className="text-base text-slate-300">
            Pick the delimiter and quote style, then convert your list to the
            format you need.
          </p>
        </section>

        <section className="mt-8 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-sm font-semibold text-slate-200">
              Config panel
            </h2>
            <div className="mt-4 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                Delimiter
                <input
                  className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60"
                  placeholder="e.g. , ; | space or ::"
                  value={customDelimiter}
                  onChange={(event) => setCustomDelimiter(event.target.value)}
                />
              </label>
              
              <label className="flex flex-col gap-2">
                Quotes
                <select
                  className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60"
                  value={quoteStyle}
                  onChange={(event) =>
                    setQuoteStyle(event.target.value as QuoteStyle)
                  }
                >
                  {quoteOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2">
                Sort output
                <select
                  className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortStyle)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
              <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1">
                <input
                  className="h-4 w-4 accent-cyan-400"
                  type="checkbox"
                  checked={quoteOnlyIfNeeded}
                  onChange={(event) =>
                    setQuoteOnlyIfNeeded(event.target.checked)
                  }
                />
                Quote only when needed
              </label>
              <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1">
                <input
                  className="h-4 w-4 accent-cyan-400"
                  type="checkbox"
                  checked={trimWhitespace}
                  onChange={(event) => setTrimWhitespace(event.target.checked)}
                />
                Trim whitespace
              </label>
              <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1">
                <input
                  className="h-4 w-4 accent-cyan-400"
                  type="checkbox"
                  checked={removeEmpty}
                  onChange={(event) => setRemoveEmpty(event.target.checked)}
                />
                Remove empty entries
              </label>
              <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1">
                <input
                  className="h-4 w-4 accent-cyan-400"
                  type="checkbox"
                  checked={deduplicate}
                  onChange={(event) => setDeduplicate(event.target.checked)}
                />
                Deduplicate items
              </label>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_180px_1fr] lg:items-center">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-slate-300">
                Column Data Here...
              </div>
              <textarea
                className="min-h-[320px] max-h-[480px] w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 outline-none ring-0 focus:border-cyan-500/60"
                placeholder="One item per line"
                value={columnInput}
                onChange={(event) => setColumnInput(event.target.value)}
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-3 self-stretch">
              <button
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-cyan-500/90 text-lg font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
                type="button"
                onClick={handleToDelimited}
              >
                →
              </button>
              <button
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-slate-800 text-lg font-semibold text-slate-100 shadow-lg shadow-black/30 hover:bg-slate-700"
                type="button"
                onClick={handleToColumn}
              >
                ←
              </button>
              <button
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-rose-500/90 text-lg font-semibold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400"
                type="button"
                onClick={handleClear}
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold text-slate-300">
                Delimited Data Here...
              </div>
              <textarea
                className="min-h-[320px] max-h-[480px] w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 outline-none ring-0 focus:border-cyan-500/60"
                placeholder="Comma or delimiter separated values"
                value={delimitedInput}
                onChange={(event) => setDelimitedInput(event.target.value)}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
