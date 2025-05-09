from fastapi import FastAPI,UploadFile,File,HTTPException,Depends,Request
from fastapi.responses import JSONResponse , FileResponse
from fastapi.background import BackgroundTasks
from PyPDF2 import PdfReader

# google api for gemini
import google.generativeai as genai
from gtts import gTTS

# database file
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import text
# from database import get_db

# IO modules
import tempfile
import os 
import io
import json
import base64


app = FastAPI()


@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response



@app.get("/hello")
async def hello():
    response = {"hello":"world"}
    return JSONResponse(content=response)


# @app.get("/generate_test_questions")
# async def get_courses(request:Request,db:AsyncSession = Depends(get_db)):
    
#     # coursesFinal = [{"id":course[0],"name":course[1]} for course in courses]
    
#     # query = text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
#     # result = await db.execute(query)
#     # tables = result.fetchall()
#     # table_list = [table[0] for table in tables]
#     # print(table_list)
#     # return {"data":table_list}
    
#     body = await request.json()

    
#     query = text('''SELECT c."pdffile" FROM "Classes" c JOIN "Courses" co ON c."coursesId" = co."id" WHERE co."id" = :course_id''')
#     result = await db.execute(query,{'course_id':body["courseId"]})
#     classPdf = result.fetchall()
    
#     try:
#         textx=""
#         for pdf in classPdf:
#             pdfstream = PdfReader(io.BytesIO(pdf[0]))
#             for page in pdfstream.pages:
#                 page_text = page.extract_text()
#                 if page_text: 
#                     textx+=page_text
#     except Exception as e:
#             raise HTTPException(status_code=500,detail="Failed to read pdf content")
        
#     try:
#         genai.configure(api_key=os.environ["GEMINI_API_KEY"])
#         model = genai.GenerativeModel("gemini-1.5-flash")
#         prompt = f"""
#         Generate a JSON response with labels of questions with question,options with options,correctAnswer with answer and explaine the correct answer name the label as explanation  of 50  based on the following text:
#         {textx}

#         Format:
#         [
#         {{"question": "Question 1", "options": ["Option 1", "Option 2", "Option 3"], "correctAnswer": "answer","explanation":"reason for the answer"}},
#         ...
#         ]
#         """
#         response =  model.generate_content(prompt)
        
#     except Exception as e:
#         raise HTTPException(status_code=400,detail="unable to generate questions")
#     qjson = json.loads(response.text[11:-6])
#     print(qjson)
    
#     return JSONResponse(content={"question_and_answers":response.text[12:-6]}) 

@app.post("/generate_mp3/")
async def generate_mp3(file:UploadFile = File(...), background_tasks: BackgroundTasks = BackgroundTasks()):
    
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file format Please upload a pdf.")

    try:
        pdf_read = PdfReader(io.BytesIO(await file.read()))
        text = ""
        for page in pdf_read.pages:
            page_text = page.extract_text()
            if page_text:
                text+=page_text
    except Exception as e:
        raise HTTPException(status_code=500,detail="Failed to read pdf content")
    try:
        
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = f""" 
        Generate a summary of the given text only with the neccessary context and also the summary should cover all the main concepts of matter:
        the matter
        {text}
        """
        
        response = model.generate_content(prompt)
        tts = gTTS(response.text,lang="en")
        with tempfile.NamedTemporaryFile(delete=False,suffix=".mp3") as tmp_file:
            tts.save(tmp_file.name)
            tmp_file_path = tmp_file.name
            
        background_tasks.add_task(os.remove,tmp_file_path)
            
        
        # return FileResponse(tmp_file_path,headers={"Content-Disposition":"attachment; filename=generated.mp3"})
        return {
            "audiofile":base64.b64encode(open(tmp_file_path,'rb').read()).decode('utf-8')
        }
    
    except Exception as e:
        raise HTTPException(status_code=500,detail="Failed to generate mp3 file")
    # finally:
    #     # Clean up the temporary file after the request
    #     if os.path.exists(tmp_file_path):
    #         os.remove(tmp_file_path)
    
    
@app.post("/pdf_generate-qa/")
async def pdf_generate_qa(file:UploadFile = File(...)):
    if file.content_type!="application/pdf":
        raise HTTPException(status_code=400,detail="Invalid file format. Please upload a PDF.")
    try:
        
        # file_location = f"./{file.filename}"
        # with open(file_location, "wb") as f:
        #     f.write(await file.read())
        
        pdf_reader = PdfReader(io.BytesIO(await file.read()))
        text=""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text +=page_text
    except Exception as e:
        raise HTTPException(status_code=500,detail="Failed to read pdf content")
    
    try:
        
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""
        Generate a JSON response with labels of questions with question,options with options,correctAnswer with answer of 10  based on the following text:
        {text}

        Format:
        [
        {{"question": "Question 1", "options": ["Option 1", "Option 2", "Option 3"], "answer": "Correct Answer"}},
        ...
        ]
        """
        response =  model.generate_content(prompt)
        return JSONResponse(content={"question_and_answers":response.text[8:-5]})
        
    except Exception as e:
        raise HTTPException(status_code=500,detail="Failed to generate questions and answers")