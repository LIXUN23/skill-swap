from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import db_manager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_manager.init_db()

class User(BaseModel):
    name: str
    email: str
    password: str
    have: str
    want: str
    link: str

class Login(BaseModel):
    email: str
    password: str

class Book(BaseModel):
    caller_email: str
    receiver_email: str

class Review(BaseModel):
    room_id: str
    rating: int

class Accept(BaseModel):
    room_id: str

# ... (Keep imports and setup) ...

# --- NEW: Get Sent Requests ---
@app.get("/my_requests")
def get_sent(email: str):
    data = db_manager.get_sent_requests(email)
    return {"requests": data}

# --- UPDATED: Polling for Active Calls ---
@app.get("/poll")
def poll(email: str):
    # 1. Check for LIVE ACCEPTED CALLS
    room_id = db_manager.check_active_call(email)
    if room_id:
        return {"incoming": True, "data": {"room_id": room_id, "type": "call"}}
    
    # 2. Check for Notifications (Pending Requests)
    notifications = db_manager.get_notifications(email)
    if notifications:
        return {"incoming": True, "data": {"type": "notification", "count": len(notifications)}}
        
    return {"incoming": False}

# ... (Keep existing routes for login, book, accept, etc.) ...

@app.get("/")
def home():
    return {"message": "SkillSwap Cloud Server Running"}

@app.post("/register")
def register(user: User):
    success = db_manager.add_user(user.name, user.email, user.password, user.have, user.want, user.link)
    if success: return {"message": "User registered"}
    raise HTTPException(status_code=400, detail="Error registering")

@app.post("/login")
def login(creds: Login):
    user = db_manager.get_user(creds.email)
    if user and str(user['password']) == creds.password:
        return {"user": user}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/search")
def search(q: str):
    results = db_manager.search_users(q)
    return {"matches": results}

@app.post("/book")
def book(req: Book):
    room_id = db_manager.create_booking(req.caller_email, req.receiver_email)
    if room_id: return {"room_id": room_id}
    raise HTTPException(status_code=400, detail="Booking failed")

@app.get("/poll")
def poll(email: str):
    # Check for INCOMING CALLS (Accepted or Pending)
    # logic: if a room exists with status 'ACCEPTED', we join it.
    # For now, we reuse notifications for the Inbox UI
    return {"incoming": False}

@app.get("/notifications")
def get_notifs(email: str):
    data = db_manager.get_notifications(email)
    return {"notifications": data}

@app.post("/accept")
def accept(req: Accept):
    success = db_manager.update_booking_status(req.room_id, "ACCEPTED")
    if success: return {"status": "connected"}
    raise HTTPException(status_code=400, detail="Failed to accept")

@app.post("/reject")
def reject(req: Accept):
    success = db_manager.update_booking_status(req.room_id, "REJECTED")
    if success: return {"status": "rejected"}
    raise HTTPException(status_code=400, detail="Failed to reject")

@app.post("/review")
def review(req: Review):
    success = db_manager.submit_review(req.room_id, req.rating)
    if success: return {"message": "Review submitted"}
    raise HTTPException(status_code=400, detail="Review failed")