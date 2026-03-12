export type DocumentType = 'marksheet' | 'id' | 'tc';

export type UploadResponse = {
  document_type: 'marksheet' | 'id_proof' | 'transfer_certificate' | 'id' | 'tc';
  filename: string;
  stored_path: string;
  size_bytes: number;
  uploaded_at: string;
};

export type StageResult = {
  stage: number;
  name: string;
  status: 'PENDING' | 'RUNNING' | 'PASS' | 'WARN' | 'FAIL';
  summary: string;
  details: Record<string, unknown>;
};

export type VerificationRunResponse = {
  run_id: string;
  started_at: string;
  stages: StageResult[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export async function uploadDocument(documentType: DocumentType, file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/uploads/${documentType}`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `Upload failed (${res.status})`);
  }
  return res.json();
}

export async function runVerification(): Promise<VerificationRunResponse> {
  const res = await fetch(`${API_BASE_URL}/api/verification/run`, { method: 'POST' });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `Run failed (${res.status})`);
  }
  return res.json();
}


