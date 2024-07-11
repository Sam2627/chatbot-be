# Run server in bash cmd: uvicorn runserver:app --reload 
# Add /docs#/ after url for Swagger UI API

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from setting_be import min_words, max_words
from clean_text import clean_text, replace_accents
from predict_ml import predict_input
from train_ml import train_ml

app = FastAPI(
    title="Machine Learing API",
    description="ML model for answer common question",
)

# Call after server is online
def start_sever():
    # Retrain model fix problem with Text Vectorizer not have idf_weight
    train_ml()
    # Load terms and model for fast access
    # load_terms_model()

# Create model that have format like json
class TextInput(BaseModel):
    text: str
    is_txt: bool = True

# Main page
@app.get("/")
def root():
    return "Hello World."

@app.get("/start")
def start():
    start_sever()
    return "Retrain model completed"

# Call train model
@app.get("/train")
async def root():
    train_ml()
    return "Ok training complete."

# Return input text
@app.post("/text")
def post_text(txt: str) -> str:
    return txt

# Return clean input text
@app.post("/text_clean")
def post_text(txt: str) -> str:
    txt = clean_text(txt)
    return txt

# Return input text with convert accents
@app.post("/text_accents")
def post_text(txt: str) -> str:
    txt = replace_accents(txt)
    return txt

# Use ML return list labels from input text
@app.post("/text_ml", status_code=200)
def post_text(txt: TextInput) -> list[str]:
    get_txt = getattr(txt, "text", "")

    # Get length of process input text and raise error if it too short
    get_txt = clean_text(get_txt)
    num_txt = len(get_txt.split())
    if num_txt < min_words:
        raise HTTPException(status_code=400, detail="Câu hỏi quá ngắn!")
    
    # Otherwise keep predict input
    result = predict_input(get_txt)
    return result

# Use check input lenght is valid
@app.post("/len_text")
def post_text(txt: TextInput) -> bool:
    get_txt = getattr(txt, "text", "")
    get_txt = clean_text(get_txt)
    # Find numbers of words in text
    num_txt = len(get_txt.split())
    if min_words <= num_txt <= max_words:
        return True
    else:
        return False

#### TEST API ####

# # Test load model
# @app.get("/test_load_model")
# def test_load_model():
#     load_model_test()
#     return "Load modeled"

# # Test using model
# @app.get("/test_text_ml")
# def test_post_text() -> list[str]:
#     get_txt = "Học phí của trường"

#     # Get length of process input text and raise error if it too short
#     get_txt = clean_text(get_txt)
#     num_txt = len(get_txt.split())
#     if num_txt < min_words:
#         raise HTTPException(status_code=400, detail="Câu hỏi quá ngắn!")
    
#     # Otherwise keep predict input
#     result = predict_input(get_txt)
#     return result