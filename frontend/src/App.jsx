import React, { useState } from 'react';

export default function App() {
  const [templateId, setTemplateId] = useState('');
  const [styleDesc, setStyleDesc] = useState('');
  const [hint, setHint] = useState('minimal');
  const [jsonData, setJsonData] = useState('{\n  "customer": {"name": "Alice"}\n}');
  const [message, setMessage] = useState('');

  async function createTemplate(e) {
    e.preventDefault();
    const res = await fetch('/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ style_desc: styleDesc, hint })
    });
    const data = await res.json();
    setTemplateId(data.template_id);
    setMessage(`Created template ${data.template_id}`);
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
    <div>
      <h1>ERP Document Generator</h1>

      <section>
        <h2>Create Template</h2>
        <form onSubmit={createTemplate}>
          <label>
            Style Description:
            <input value={styleDesc} onChange={e => setStyleDesc(e.target.value)} />
          </label>
          <label>
            Hint:
            <select value={hint} onChange={e => setHint(e.target.value)}>
              <option value="minimal">Minimal</option>
              <option value="corporate">Corporate</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
            </select>
          </label>
          <button type="submit">Create</button>
        </form>
      </section>

      <section>
        <h2>Generate Document</h2>
        <form onSubmit={generateDocument}>
          <label>
            Template ID:
            <input value={templateId} onChange={e => setTemplateId(e.target.value)} />
          </label>
          <label>
            JSON Data:
            <textarea rows="6" value={jsonData} onChange={e => setJsonData(e.target.value)} />
          </label>
          <button type="submit">Generate</button>
        </form>
      </section>

      {message && <p>{message}</p>}
    </div>
  );
}
