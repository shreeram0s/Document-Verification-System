import { useMemo, useState } from 'react';
import './App.css';
import { runVerification, uploadDocument, type DocumentType, type StageResult, type VerificationRunResponse } from './api';

function App() {
  const [files, setFiles] = useState<Partial<Record<DocumentType, File>>>({});
  const [uploading, setUploading] = useState<Partial<Record<DocumentType, boolean>>>({});
  const [error, setError] = useState<string | null>(null);
  const [run, setRun] = useState<VerificationRunResponse | null>(null);
  const [running, setRunning] = useState(false);

  const allUploaded = useMemo(() => {
    return Boolean(files.marksheet && files.id && files.tc);
  }, [files]);

  async function handlePick(dt: DocumentType, file: File | null) {
    if (!file) return;
    setError(null);
    setRun(null);
    setUploading((p) => ({ ...p, [dt]: true }));
    try {
      await uploadDocument(dt, file);
      setFiles((p) => ({ ...p, [dt]: file }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading((p) => ({ ...p, [dt]: false }));
    }
  }

  async function handleRun() {
    setError(null);
    setRunning(true);
    setRun(null);
    try {
      const r = await runVerification();
      setRun(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  function StatusPill({ s }: { s: StageResult['status'] }) {
    const cls =
      s === 'PASS' ? 'pill pass' : s === 'WARN' ? 'pill warn' : s === 'FAIL' ? 'pill fail' : 'pill';
    return <span className={cls}>{s}</span>;
  }

  return (
    <div className="container">
      <header className="header">
        <div className="brand">DVS Platform</div>
        <div className="sub">Production build (starting scaffold)</div>
      </header>

      <main className="main">
        <section className="card">
          <h2>Upload documents</h2>
          <p className="muted">Upload the three required documents. Then run the verification pipeline.</p>

          <div className="grid">
            <label className="upload">
              <div className="uploadTitle">Mark Sheet / Transcript</div>
              <div className="uploadHint">PDF/JPG/PNG · max 5MB</div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handlePick('marksheet', e.target.files?.[0] ?? null)}
              />
              <div className="uploadMeta">
                <span>{files.marksheet?.name ?? 'No file selected'}</span>
                {uploading.marksheet ? <span className="muted">Uploading…</span> : null}
              </div>
            </label>

            <label className="upload">
              <div className="uploadTitle">ID Proof</div>
              <div className="uploadHint">Aadhaar/Passport · PDF/JPG/PNG</div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handlePick('id', e.target.files?.[0] ?? null)}
              />
              <div className="uploadMeta">
                <span>{files.id?.name ?? 'No file selected'}</span>
                {uploading.id ? <span className="muted">Uploading…</span> : null}
              </div>
            </label>

            <label className="upload">
              <div className="uploadTitle">Transfer / Migration Certificate</div>
              <div className="uploadHint">Original scan · PDF/JPG/PNG</div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handlePick('tc', e.target.files?.[0] ?? null)}
              />
              <div className="uploadMeta">
                <span>{files.tc?.name ?? 'No file selected'}</span>
                {uploading.tc ? <span className="muted">Uploading…</span> : null}
              </div>
            </label>
          </div>

          <div className="row">
            <button className="btn" disabled={!allUploaded || running} onClick={handleRun}>
              {running ? 'Running…' : 'Run verification'}
            </button>
            <div className="muted">{allUploaded ? 'Ready' : 'Upload all 3 documents to continue'}</div>
          </div>

          {error ? <div className="error">{error}</div> : null}
        </section>

        <section className="card">
          <h2>Verification results</h2>
          {!run ? (
            <p className="muted">No run yet. Upload documents and click “Run verification”.</p>
          ) : (
            <>
              <div className="muted">Run ID: {run.run_id}</div>
              <div className="stages">
                {run.stages.map((s) => (
                  <div key={s.stage} className="stageRow">
                    <div className="stageLeft">
                      <div className="stageTitle">
                        Stage {s.stage} — {s.name}
                      </div>
                      <div className="stageSummary">{s.summary}</div>
                    </div>
                    <StatusPill s={s.status} />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App
