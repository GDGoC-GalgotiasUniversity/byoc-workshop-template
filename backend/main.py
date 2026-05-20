from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.llm_config import get_llm

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/test-chat")
async def test_chat(q: str = "Hello"):
    llm = get_llm(use_cloud=False)
    response = llm.invoke(q)
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
