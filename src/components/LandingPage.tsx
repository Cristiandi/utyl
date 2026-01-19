const tools = [
  {
    title: 'Compare Lists',
    description:
      'Diff two lists and find overlaps, uniques, and mismatches instantly.',
    href: '/tools/compare-lists',
  },
  {
    title: 'Deduplicate List',
    description: 'Remove duplicate entries and keep only unique values.',
    href: '/tools/deduplicate-list',
  },
  {
    title: 'Delimiter ↔ Comma',
    description:
      'Swap between comma-separated and line-separated values in one click.',
    href: '/tools/delimiter-comma',
  },
  {
    title: 'JSON ↔ CSV',
    description: 'Convert structured data to the format your workflow needs.',
    href: '/tools/json-csv',
  },
  {
    title: 'JSON Formatter',
    description: 'Prettify, validate, and quickly spot structural issues.',
  },
];

const highlights = [
  'Local-first: run everything in the browser.',
  'Fast paste-in, clean results.',
  'Copy, download, and share-friendly output.',
  'Keyboard-friendly for daily use.',
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f14] text-slate-100">
      <div className="pointer-events-none absolute -left-32 top-[-240px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-200px] top-40 h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[140px]" />
      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3 text-lg font-semibold text-slate-100">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-200">
            U
          </span>
          Utyl
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a className="hover:text-white" href="#tools">
            Tools
          </a>
          <a className="hover:text-white" href="#workflow">
            Workflow
          </a>
          <a className="hover:text-white" href="#cta">
            Get started
          </a>
        </nav>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-10">
        <section className="grid gap-10">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Developer utilities
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Daily tools that clean up data and speed up shipping.
            </h1>
            <p className="text-lg text-slate-300">
              Utyl is a lightweight toolbox for quick data transforms: compare
              lists, convert formats, and format JSON without leaving your
              workflow.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300"
                href="#tools"
              >
                Explore tools
              </a>
              <a
                className="rounded-full border border-slate-700 bg-slate-950/60 px-5 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
                href="#workflow"
              >
                See how it works
              </a>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-800 bg-slate-950/60 px-4 py-1"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="tools"
          className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {tools.map((tool) => {
            const content = (
              <>
                <h3 className="text-lg font-semibold text-white">
                  {tool.title}
                </h3>
                <p className="mt-3 text-sm text-slate-300">
                  {tool.description}
                </p>
              </>
            );

            if (tool.href) {
              return (
                <a
                  key={tool.title}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-cyan-400/50 hover:bg-slate-900/70"
                  href={tool.href}
                >
                  {content}
                </a>
              );
            }

            return (
              <div
                key={tool.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-cyan-400/50 hover:bg-slate-900/70"
              >
                {content}
              </div>
            );
          })}
        </section>

        <section
          id="workflow"
          className="mt-20 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-900/80 p-10"
        >
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-white">
                Built for fast inputs and cleaner outputs.
              </h2>
              <p className="text-base text-slate-300">
                Paste raw data, tweak your options, and copy the result without
                hopping across multiple sites. Every tool stays focused on one
                task with smart defaults.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                Dedicated input and output panels.
              </li>
              <li className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                Clear validation messages and formatting hints.
              </li>
              <li className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                Export as file or copy to clipboard.
              </li>
            </ul>
          </div>
        </section>

        <section
          id="cta"
          className="mt-20 flex flex-col items-start justify-between gap-6 rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-10 md:flex-row md:items-center"
        >
          <div>
            <h2 className="text-3xl font-semibold text-white">
              Ready to build your first tool?
            </h2>
            <p className="mt-2 text-sm text-cyan-100/80">
              Start with a compare lists page or a JSON formatter and expand
              from there.
            </p>
          </div>
          <a
            className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300"
            href="#tools"
          >
            View starter tools
          </a>
        </section>
      </main>
    </div>
  );
}
