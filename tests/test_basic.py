from pathlib import Path
import json
from fastapi.testclient import TestClient
import sys
from pathlib import Path as _Path
sys.path.append(str(_Path(__file__).resolve().parents[1]))
from backend.main import app, TEMPLATE_DIR, OUTPUT_DIR

client = TestClient(app)

def test_create_and_generate(tmp_path):
    # create template
    response = client.post('/templates', data={'style_desc': '', 'hint': ''})
    assert response.status_code == 200
    template_id = response.json()['template_id']
    template_path = TEMPLATE_DIR / f'{template_id}.docx'
    assert template_path.exists()

    # generate document
    data = {'name': 'Alice'}
    files = {'data': ('data.json', json.dumps(data), 'application/json')}
    response = client.post(f'/documents/{template_id}', files=files)
    assert response.status_code == 200
    doc_path = Path(response.json()['document'])
    assert doc_path.exists()
    # Clean up
    template_path.unlink()
    doc_path.unlink()
