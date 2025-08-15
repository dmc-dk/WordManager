from fastapi import FastAPI, UploadFile, File, HTTPException
from docxtpl import DocxTemplate
from docx import Document
import json
import uuid
from pathlib import Path

app = FastAPI()
TEMPLATE_DIR = Path('templates')
OUTPUT_DIR = Path('generated')

@app.post('/templates')
async def create_template(style_desc: str = '', hint: str = '', reference: UploadFile | None = None):
    """Create a blank Word template.

    In a real implementation the style description and optional reference
    document would influence the produced template.  For now we simply
    generate an empty template that can be used for JSON merging.
    """
    template_path = TEMPLATE_DIR / f"{uuid.uuid4()}.docx"
    Document().save(template_path)
    return {'template_id': template_path.stem}

@app.post('/documents/{template_id}')
async def generate_document(template_id: str, data: UploadFile = File(...)):
    template_path = TEMPLATE_DIR / f'{template_id}.docx'
    if not template_path.exists():
        raise HTTPException(status_code=404, detail='Template not found')
    context = json.loads(await data.read())
    tpl = DocxTemplate(template_path)
    tpl.render(context)
    out_path = OUTPUT_DIR / f"{template_id}-{uuid.uuid4()}.docx"
    tpl.save(out_path)
    return {'document': str(out_path)}
