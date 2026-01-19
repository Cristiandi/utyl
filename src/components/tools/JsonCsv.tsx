import { useRef, useState } from 'react';
import {
  csvToJson,
  jsonToCsv,
  type CsvSeparator,
  type CsvToJsonOptions,
} from '../../lib/tools/json-csv';

const separatorOptions: { label: string; value: CsvSeparator | 'auto' }[] = [
  { label: 'Auto-detect', value: 'auto' },
  { label: ',', value: ',' },
  { label: ';', value: ';' },
  { label: '|', value: '|' },
  { label: 'Tab', value: '\t' },
];

export default function JsonCsv() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [inputType, setInputType] = useState<'csv' | 'json'>('csv');
  const [separator, setSeparator] = useState<CsvSeparator | 'auto'>('auto');
  const [parseNumbers, setParseNumbers] = useState(true);
  const [parseJson, setParseJson] = useState(true);
  const [transpose, setTranspose] = useState(false);
  const [outputType, setOutputType] = useState<'array' | 'hash'>('array');
  const [minify, setMinify] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleConvert = () => {
    try {
      if (inputType === 'csv') {
        const options: CsvToJsonOptions = {
          separator,
          parseNumbers,
          parseJson,
          transpose,
          output: outputType,
          minify,
        };
        setOutput(csvToJson(input, options));
      } else {
        setOutput(jsonToCsv(input, { separator: ',' }));
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    }
  };

  const validateFile = (file: File) => {
    const name = file.name.toLowerCase();
    const isJson = name.endsWith('.json') || file.type === 'application/json';
    const isCsv =
      name.endsWith('.csv') ||
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel';

    if (inputType === 'csv' && !isCsv) {
      return 'Please upload a CSV file when CSV is selected.';
    }
    if (inputType === 'json' && !isJson) {
      return 'Please upload a JSON file when JSON is selected.';
    }
    return null;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      event.target.value = '';
      return;
    }

    const text = await file.text();
    if (inputType === 'json') {
      try {
        JSON.parse(text);
      } catch {
        setError('Invalid JSON file.');
        event.target.value = '';
        return;
      }
    }

    setInput(text);
    setError(null);
    event.target.value = '';
  };

  const handleDownload = () => {
    if (!output) {
      return;
    }

    const extension = inputType === 'csv' ? 'json' : 'csv';
    const blob = new Blob([output], {
      type: extension === 'json' ? 'application/json' : 'text/csv',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `utyl-output.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
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
        <div className="text-sm text-slate-400">JSON ↔ CSV</div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold text-white">
            Convert JSON and CSV instantly.
          </h1>
          <p className="text-base text-slate-300">
            Choose the input format, then convert to the opposite output.
          </p>
        </section>

        <section className="mt-8 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="text-slate-400">Input:</span>
              <label className="inline-flex items-center gap-2">
                <input
                  className="h-4 w-4 accent-cyan-400"
                  type="radio"
                  checked={inputType === 'csv'}
                  onChange={() => setInputType('csv')}
                />
                CSV
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  className="h-4 w-4 accent-cyan-400"
                  type="radio"
                  checked={inputType === 'json'}
                  onChange={() => setInputType('json')}
                />
                JSON
              </label>
            </div>

            {inputType === 'csv' && (
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    Separator
                    <select
                      className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60"
                      value={separator}
                      onChange={(event) =>
                        setSeparator(event.target.value as CsvSeparator | 'auto')
                      }
                    >
                      {separatorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                  <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1">
                    <input
                      className="h-4 w-4 accent-cyan-400"
                      type="checkbox"
                      checked={parseNumbers}
                      onChange={(event) =>
                        setParseNumbers(event.target.checked)
                      }
                    />
                    Parse numbers
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1">
                    <input
                      className="h-4 w-4 accent-cyan-400"
                      type="checkbox"
                      checked={parseJson}
                      onChange={(event) => setParseJson(event.target.checked)}
                    />
                    Parse JSON
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1">
                    <input
                      className="h-4 w-4 accent-cyan-400"
                      type="checkbox"
                      checked={transpose}
                      onChange={(event) => setTranspose(event.target.checked)}
                    />
                    Transpose
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="text-slate-400">Output:</span>
                  <label className="inline-flex items-center gap-2">
                    <input
                      className="h-4 w-4 accent-cyan-400"
                      type="radio"
                      checked={outputType === 'array'}
                      onChange={() => setOutputType('array')}
                    />
                    Array
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      className="h-4 w-4 accent-cyan-400"
                      type="radio"
                      checked={outputType === 'hash'}
                      onChange={() => setOutputType('hash')}
                    />
                    Hash
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1">
                    <input
                      className="h-4 w-4 accent-cyan-400"
                      type="checkbox"
                      checked={minify}
                      onChange={(event) => setMinify(event.target.checked)}
                    />
                    Minify
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-slate-300">Input</div>
              <textarea
                className="min-h-[260px] max-h-[480px] w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 outline-none ring-0 focus:border-cyan-500/60"
                placeholder={
                  inputType === 'csv'
                    ? 'Paste CSV here'
                    : 'Paste JSON here'
                }
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300"
                  type="button"
                  onClick={handleConvert}
                >
                  Convert
                </button>
                <button
                  className="rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/60"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload file
                </button>
                <input
                  ref={fileInputRef}
                  className="hidden"
                  type="file"
                  accept=".csv,.json,text/csv,application/json"
                  onChange={handleFileUpload}
                />
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
                onClick={handleDownload}
                disabled={!output}
              >
                Download result
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
