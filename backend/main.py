from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.template import router as template_router

from routes.auth import router as auth_router
from routes.retreats import router as retreats_router
from routes.search import router as search_router


app = FastAPI()


# =============================
# CORS
# =============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# =============================
# ROUTERS
# =============================

app.include_router(auth_router)
app.include_router(retreats_router)
app.include_router(search_router)
app.include_router(template_router)


# =============================
# HOME
# =============================

@app.get("/")
def home():

    return {
        "message": "Backend Connected Successfully"
    }
