import os
from supabase import create_client, Client
import uuid

# --- CONFIGURATION ---
SUPABASE_URL = "https://hlwclvppqwworenjssse.supabase.co"
# REPLACE THIS WITH YOUR ACTUAL 'anon public' KEY IF THE ONE BELOW FAILS
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsd2NsdnBwcXd3b3Jlbmpzc3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NjU5NTksImV4cCI6MjA4NTQ0MTk1OX0.PknXYOaDQ7u0Ze0gS7BWtS_kpXb8prXuzllUzRle2Yc"

# Connect to the cloud
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def init_db():
    print("✅ Connected to Supabase Cloud")

def add_user(name, email, password, have_skills, want_skills, proof_link, credits=30, verified=0):
    try:
        data = {
            "full_name": name,
            "email": email,
            "password": password,
            "have_skills": have_skills,
            "want_skills": want_skills,
            "portfolio_link": proof_link,
            "credits": credits,
            "verified": verified
        }
        supabase.table("users").insert(data).execute()
        return True
    except Exception as e:
        print(f"Error adding user: {e}")
        return False

def get_user(email):
    try:
        response = supabase.table("users").select("*").eq("email", email).execute()
        if response.data:
            user = response.data[0]
            # Map 'full_name' to 'name' for frontend compatibility
            user['name'] = user.get('full_name', user.get('name')) 
            # Map 'have_skills' to 'have'
            user['have'] = user.get('have_skills', user.get('have'))
            # Map 'want_skills' to 'want'
            user['want'] = user.get('want_skills', user.get('want'))
            return user
        return None
    except Exception as e:
        print(f"Error getting user: {e}")
        return None

def search_users(query):
    try:
        response = supabase.table("users").select("*").ilike("have_skills", f"%{query}%").execute()
        results = []
        for user in response.data:
            user['name'] = user.get('full_name')
            user['have'] = user.get('have_skills')
            user['want'] = user.get('want_skills')
            results.append(user)
        return results
    except Exception as e:
        print(f"Search error: {e}")
        return []

def create_booking(caller_email, receiver_email):
    try:
        # 1. Check Caller Credits
        caller_resp = supabase.table("users").select("*").eq("email", caller_email).execute()
        if not caller_resp.data: return None
        
        caller = caller_resp.data[0]
        if caller['credits'] < 5:
            return None 

        # 2. Deduct Credits
        new_credits = caller['credits'] - 5
        supabase.table("users").update({"credits": new_credits}).eq("email", caller_email).execute()

        # 3. Create Booking
        room_id = f"Nexus_Secure_{uuid.uuid4().hex[:8]}"
        booking_data = {
            "caller_email": caller_email,
            "receiver_email": receiver_email,
            "room_id": room_id,
            "status": "PENDING"
        }
        supabase.table("bookings").insert(booking_data).execute()
        return room_id
    except Exception as e:
        print(f"Booking Error: {e}")
        return None

def submit_review(room_id, rating):
    try:
        # 1. Find Booking
        booking_resp = supabase.table("bookings").select("*").eq("room_id", room_id).execute()
        if not booking_resp.data: return False
        booking = booking_resp.data[0]
        teacher_email = booking['receiver_email']
        
        # 2. Get Teacher & Pay
        teacher_resp = supabase.table("users").select("*").eq("email", teacher_email).execute()
        if teacher_resp.data:
            teacher = teacher_resp.data[0]
            new_credits = teacher['credits'] + (rating * 2)
            supabase.table("users").update({"credits": new_credits}).eq("email", teacher_email).execute()
        
        # 3. Close Booking
        supabase.table("bookings").update({"status": "COMPLETED"}).eq("room_id", room_id).execute()
        return True
    except Exception as e:
        print(f"Review Error: {e}")
        return False

# --- NEW: NOTIFICATIONS & STATUS UPDATES ---

def get_notifications(user_email):
    """Fetches PENDING requests for the teacher."""
    try:
        response = supabase.table("bookings").select("*").eq("receiver_email", user_email).eq("status", "PENDING").execute()
        
        results = []
        if response.data:
            for booking in response.data:
                # Fetch learner name for UI
                learner_email = booking['caller_email']
                learner_resp = supabase.table("users").select("full_name").eq("email", learner_email).execute()
                learner_name = learner_resp.data[0]['full_name'] if learner_resp.data else learner_email.split('@')[0]
                
                results.append({
                    "id": booking['room_id'],
                    "learner": learner_name,
                    "skill": "Requested Skill",
                    "time": "Pending Action",
                    "status": booking['status']
                })
        return results
    except Exception as e:
        print(f"Notification Error: {e}")
        return []

def update_booking_status(room_id, status):
    """Accepts or Rejects a booking."""
    try:
        supabase.table("bookings").update({"status": status}).eq("room_id", room_id).execute()
        return True
    except Exception as e:
        print(f"Update Error: {e}")
        return False

# ... (Keep existing imports and functions) ...

def get_sent_requests(user_email):
    """Fetches requests sent BY this user (for 'My Requests' tab)."""
    try:
        response = supabase.table("bookings").select("*").eq("caller_email", user_email).execute()
        data: List[Dict[str, Any]] = response.data
        
        results = []
        if data:
            for booking in data:
                # Fetch receiver's name for display
                receiver_email = booking.get('receiver_email')
                receiver_resp = supabase.table("users").select("full_name").eq("email", receiver_email).execute()
                receiver_data = receiver_resp.data
                
                receiver_name = receiver_data[0]['full_name'] if receiver_data else receiver_email.split('@')[0]
                
                results.append({
                    "id": booking.get('room_id'),
                    "receiver": receiver_name,
                    "receiver_email": receiver_email,
                    "status": booking.get('status')
                })
        return results
    except Exception as e:
        print(f"Sent Requests Error: {e}")
        return []

def check_active_call(user_email):
    """Checks if there is an ACCEPTED call for this user to join."""
    try:
        # Check if user is a caller OR receiver in an ACCEPTED booking
        # Supabase 'or' syntax: .or_(f"caller_email.eq.{user_email},receiver_email.eq.{user_email}")
        response = supabase.table("bookings").select("*").or_(f"caller_email.eq.{user_email},receiver_email.eq.{user_email}").eq("status", "ACCEPTED").execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]['room_id']
        return None
    except Exception as e:
        print(f"Active Call Check Error: {e}")
        return None