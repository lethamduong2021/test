
from docx import Document

async def extract_content(file):
    filename = file.filename
    if filename.endswith(".txt"):
        return (await file.read()).decode("utf-8")
    elif filename.endswith(".docx"):
        document = Document(file.file)
        return "\n".join([p.text for p in document.paragraphs])
    else:
        return "Unsupported file type"
