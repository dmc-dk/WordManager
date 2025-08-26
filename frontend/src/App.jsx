import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [templateId, setTemplateId] = useState('');
  const [styleDesc, setStyleDesc] = useState('');
  const [hint, setHint] = useState('minimal');
  const [jsonData, setJsonData] = useState('{\n  "customer": {"name": "Alice"}\n}');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  async function createTemplate(e) {
    e.preventDefault();
    setCreating(true);
    setMessage('');
    setDownloadUrl('');
    const res = await fetch('/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ style_desc: styleDesc, hint })
    });
    const data = await res.json();
    setTemplateId(data.template_id);
    setDownloadUrl(data.download_url);
    setMessage(`Created template ${data.template_id}`);
    setCreating(false);
  }

  async function generateDocument(e) {
    e.preventDefault();
    if (!templateId) {
      setMessage('Create a template first.');
      return;
    }
    const res = await fetch(`/documents/${templateId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonData
    });
    const data = await res.json();
    setMessage(`Generated document at ${data.document}`);
  }

  return (
    <div className="container">
      <h1>ERP Document Generator</h1>

      <section className="card">
        <h2>Create Template</h2>
        <form className="form" onSubmit={createTemplate}>
          <div className="form-group">
            <label htmlFor="styleDesc">Style Description</label>
            <input id="styleDesc" value={styleDesc} onChange={e => setStyleDesc(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="hint">Hint</label>
            <select id="hint" value={hint} onChange={e => setHint(e.target.value)}>
              <option value="minimal">Minimal</option>
              <option value="corporate">Corporate</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
            </select>
          </div>
          <button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
        </form>
        {downloadUrl && (
          <p>
            <a href={downloadUrl}>Download template</a>
          </p>
        )}
      </section>

      <section className="card">
        <h2>Generate Document</h2>
        <form className="form" onSubmit={generateDocument}>
          <div className="form-group">
            <label htmlFor="templateId">Template ID</label>
            <input id="templateId" value={templateId} onChange={e => setTemplateId(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="jsonData">JSON Data</label>
            <textarea id="jsonData" rows="6" value={jsonData} onChange={e => setJsonData(e.target.value)} />
          </div>
          <button type="submit">Generate</button>
        </form>
      </section>

      {message && <p>{message}</p>}
    </div>
  );
}
