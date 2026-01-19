import { useState } from 'react';
import { formatJson, tryFixJson } from '../../lib/tools/json-formatter';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [minify, setMinify] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      setOutput(formatJson(input, { minify }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const handleFix = () => {
    try {
      const fixed = tryFixJson(input);
      setInput(fixed);
      setOutput(formatJson(fixed, { minify }));
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Fix failed: ${err.message}`
          : 'Fix failed: Invalid JSON'
      );
    }
  };

  const handleCopy = async () => {
    if (!output) {
      return;
    }
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
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
        <div className="text-sm text-slate-400">JSON Formatter</div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold text-white">
            Format and validate JSON.
          </h1>
          <p className="text-base text-slate-300">
            Paste JSON, validate it, and get clean formatted output.
          </p>
        </section>

        <section className="mt-8 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1">
                <input
                  className="h-4 w-4 accent-cyan-400"
                  type="checkbox"
                  checked={minify}
                  onChange={(event) => setMinify(event.target.checked)}
                />
                Minify output
              </label>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-slate-300">Input</div>
              <textarea
                className="min-h-[260px] max-h-[480px] w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 outline-none ring-0 focus:border-cyan-500/60"
                placeholder="Paste JSON here"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300"
                  type="button"
                  onClick={handleFormat}
                >
                  Format JSON
                </button>
                <button
                  className="rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60"
                  type="button"
                  onClick={handleFix}
                  disabled={!input}
                >
                  Try to fix
                </button>
              </div>
              {error && <p className="text-xs text-rose-300">{error}</p>}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold text-slate-300">Output</div>
              <textarea
                className="min-h-[260px] max-h-[480px] w-full resize-none overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 outline-none"
                value={output}
                readOnly
              />
              <button
                className="inline-flex rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                onClick={handleCopy}
                disabled={!output}
              >
                {copied ? 'Copied' : 'Copy output'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
