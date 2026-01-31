from db_manager import init_db, add_user
import os

# 1. Reset Database
if os.path.exists("nexus.db"):
    os.remove("nexus.db")
    print("🗑️  Old Database removed.")

init_db()
print("🌱 Seeding 100+ Users with 30 Credits & REAL Proof Links...")

# 2. REAL DATA
users = [
    {"n": "Ananya Sharma", "h": "Public Speaking (Intermediate), Debate (Basic)", "w": "Video Editing, Podcast Hosting"},
    {"n": "Rohit Verma", "h": "Video Editing (Expert), Thumbnail Design (Intermediate)", "w": "Storytelling, Public Speaking"},
    {"n": "Meera Iyer", "h": "Yoga (Intermediate), Meditation (Expert)", "w": "Nutrition Basics, Fitness Training"},
    {"n": "Karthik Reddy", "h": "Fitness Training (Intermediate), Nutrition Basics", "w": "Yoga, Mental Wellness"},
    {"n": "Pooja Nair", "h": "Photography (Intermediate), Mobile Photography (Expert)", "w": "Photo Editing, Visual Storytelling"},
    {"n": "Arjun Malhotra", "h": "Photo Editing (Expert), Canva Design (Intermediate)", "w": "Photography, Branding"},
    {"n": "Siddharth Jain", "h": "Python Programming (Intermediate), Logical Thinking (Expert)", "w": "Machine Learning, Data Analysis"},
    {"n": "Neha Kulkarni", "h": "Data Analysis (Intermediate), Excel (Expert)", "w": "Python, SQL"},
    {"n": "Kavya Menon", "h": "Classical Dance (Expert), Stage Confidence (Intermediate)", "w": "Acting, Choreography"},
    {"n": "Ayaan Khan", "h": "Acting (Intermediate), Expression Control (Expert)", "w": "Dance, Voice Modulation"},
    {"n": "Ritika Gupta", "h": "Cooking (Intermediate), Baking (Basic)", "w": "Nutrition Science, Food Photography"},
    {"n": "Dev Patel", "h": "Food Photography (Expert), Instagram Growth (Intermediate)", "w": "Baking, Recipe Writing"},
    {"n": "Aditya Singh", "h": "Guitar (Intermediate), Music Theory (Basic)", "w": "Singing, Audio Recording"},
    {"n": "Shreya Bose", "h": "Singing (Expert), Voice Training (Intermediate)", "w": "Guitar, Songwriting"},
    {"n": "Manish Choudhary", "h": "Graphic Design (Intermediate), Logo Design (Basic)", "w": "UI/UX, Branding Psychology"},
    {"n": "Ishita Roy", "h": "UI/UX Design (Expert), User Research (Intermediate)", "w": "Illustration, Motion Design"},
    {"n": "Rahul Mehta", "h": "Creative Writing (Expert), Poetry (Intermediate)", "w": "Blogging, SEO Writing"},
    {"n": "Sneha Pillai", "h": "SEO Writing (Intermediate), Blogging (Expert)", "w": "Copywriting, Personal Branding"},
    {"n": "Nikhil Agarwal", "h": "Personal Finance (Intermediate), Budgeting (Expert)", "w": "Stock Market Basics, Investment Psychology"},
    {"n": "Priya Deshmukh", "h": "Stock Market Basics (Intermediate), Mutual Funds (Expert)", "w": "Tax Planning, Personal Finance Tools"},
    {"n": "Varun Kapoor", "h": "Time Management (Expert), Goal Setting (Intermediate)", "w": "Habit Building, Productivity Systems"},
    {"n": "Aishwarya Kulkarni", "h": "Habit Building (Expert), Journaling (Intermediate)", "w": "Mindfulness, Life Coaching"},
    {"n": "Rohan Sen", "h": "Sketching (Intermediate), Digital Art (Basic)", "w": "Illustration, Character Design"},
    {"n": "Tanvi Joshi", "h": "Illustration (Expert), Character Design (Intermediate)", "w": "Animation Basics, Storyboarding"},
    {"n": "Mohammed Irfan", "h": "English Speaking (Intermediate), Grammar Basics (Expert)", "w": "Accent Training, Confidence Building"},
    {"n": "Rhea D'Souza", "h": "Accent Training (Expert), Communication Skills (Intermediate)", "w": "Public Speaking, Debate"},
    {"n": "Suresh Naidu", "h": "Meditation (Intermediate), Stress Management (Expert)", "w": "Sleep Optimization, Breathwork"},
    {"n": "Anjali Mishra", "h": "Breathwork (Expert), Sleep Science (Intermediate)", "w": "Meditation, Yoga Nidra"},
    {"n": "Harshavardhan Rao", "h": "Event Anchoring (Intermediate), Crowd Handling (Expert)", "w": "Script Writing, Voice Modulation"},
    {"n": "Nandini Saxena", "h": "Script Writing (Expert), Story Structure (Intermediate)", "w": "Anchoring, Improvisation"},
    {"n": "Kunal Bhattacharya", "h": "Chess (Expert), Strategic Thinking (Intermediate)", "w": "Game Theory, Problem Solving"},
    {"n": "Lavanya Rao", "h": "Problem Solving (Expert), Logical Reasoning (Intermediate)", "w": "Chess, Critical Thinking"},
    {"n": "Abhishek Yadav", "h": "Car Driving (Intermediate), Road Safety Rules (Expert)", "w": "Basic Car Maintenance, Navigation Skills"},
    {"n": "Pallavi Kulkarni", "h": "Car Maintenance (Intermediate), Vehicle Basics (Expert)", "w": "Driving, Highway Confidence"},
    {"n": "Sanjay Iyer", "h": "Gardening (Expert), Organic Farming (Intermediate)", "w": "Composting, Plant Disease Control"},
    {"n": "Keerthi R", "h": "Composting (Expert), Sustainable Living (Intermediate)", "w": "Gardening, Home Farming"},
    {"n": "Aman Saxena", "h": "Basic First Aid (Expert), Emergency Response (Intermediate)", "w": "CPR, Disaster Management"},
    {"n": "Sowmya G", "h": "CPR (Expert), Disaster Preparedness (Intermediate)", "w": "First Aid Teaching, Community Safety"},
    {"n": "Ritesh Pandey", "h": "Travel Planning (Intermediate), Budget Travel (Expert)", "w": "Travel Vlogging, Photography"},
    {"n": "Aditi Chavan", "h": "Travel Vlogging (Expert), Video Storytelling (Intermediate)", "w": "Budget Planning, Solo Travel Safety"},
    {"n": "Naveen Kumar", "h": "Electric Repairs (Intermediate), Wiring Basics (Expert)", "w": "Home Automation, Smart Devices"},
    {"n": "Shruti Malhotra", "h": "Home Automation (Expert), IoT Basics (Intermediate)", "w": "Electrical Safety, Wiring Techniques"},
    {"n": "Faizan Ali", "h": "Calligraphy (Expert), Hand Lettering (Intermediate)", "w": "Digital Art, Typography"},
    {"n": "Mansi Patel", "h": "Digital Art (Expert), Typography (Intermediate)", "w": "Calligraphy, Hand Lettering"},
    {"n": "Prakash Shetty", "h": "Home Cooking (Expert), South Indian Cuisine (Intermediate)", "w": "Food Plating, Continental Cooking"},
    {"n": "Elina Fernandez", "h": "Continental Cooking (Expert), Food Presentation (Intermediate)", "w": "Regional Indian Dishes, Spice Blending"},
    {"n": "Vivek Arora", "h": "Resume Building (Expert), Interview Preparation (Intermediate)", "w": "Mock Interviewing, Career Coaching"},
    {"n": "Sonal Mehra", "h": "Career Coaching (Expert), Confidence Building (Intermediate)", "w": "Resume Review, Corporate Etiquette"},
    {"n": "Ajay Prasad", "h": "Bike Repair (Expert), Engine Basics (Intermediate)", "w": "Electric Vehicles, Battery Technology"},
    {"n": "Ira Mukherjee", "h": "EV Basics (Expert), Battery Systems (Intermediate)", "w": "Mechanical Repairs, Vehicle Diagnostics"},
    {"n": "Sathvik R", "h": "Speed Reading (Expert), Memory Techniques (Intermediate)", "w": "Note Making, Exam Strategies"},
    {"n": "Anusha P", "h": "Exam Strategies (Expert), Smart Note Making (Intermediate)", "w": "Memory Improvement, Reading Techniques"},
    {"n": "Rahil Khan", "h": "Fitness Nutrition (Intermediate), Meal Planning (Expert)", "w": "Strength Training, Calorie Tracking"},
    {"n": "Divya S", "h": "Strength Training (Expert), Gym Workouts (Intermediate)", "w": "Diet Planning, Recovery Nutrition"},
    {"n": "Keshav Mishra", "h": "Story Narration (Expert), Voice Acting (Intermediate)", "w": "Audio Editing, Podcast Production"},
    {"n": "Nikita Fernandes", "h": "Audio Editing (Expert), Podcast Hosting (Intermediate)", "w": "Voice Modulation, Storytelling"},
    {"n": "Yash Agarwal", "h": "Budgeting (Expert), Expense Tracking (Intermediate)", "w": "Investment Basics, Financial Planning"},
    {"n": "Radhika Joshi", "h": "Investment Basics (Expert), Wealth Planning (Intermediate)", "w": "Budget Optimization, Personal Finance Tools"},
    {"n": "Imran Shaikh", "h": "Social Media Management (Expert), Content Scheduling (Intermediate)", "w": "Analytics, Growth Hacking"},
    {"n": "Purnima Das", "h": "Social Media Analytics (Expert), Performance Tracking (Intermediate)", "w": "Content Strategy, Brand Voice"},
    {"n": "Lokesh V", "h": "Woodworking (Intermediate), DIY Furniture (Expert)", "w": "Interior Design, Space Planning"},
    {"n": "Shanaya Kapoor", "h": "Interior Design (Expert), Color Theory (Intermediate)", "w": "DIY Crafts, Furniture Design"},
    {"n": "Harini S", "h": "Candle Making (Expert), Home Decor Crafts (Intermediate)", "w": "Online Selling, Product Photography"},
    {"n": "Raghav Bansal", "h": "Product Photography (Expert), Lighting Techniques (Intermediate)", "w": "Handmade Crafts, Small Business Setup"},
    {"n": "Tejaswini M", "h": "Language Learning (Expert), Telugu Teaching (Intermediate)", "w": "Hindi, Translation Skills"},
    {"n": "Amit Tiwari", "h": "Hindi Teaching (Expert), Translation (Intermediate)", "w": "Telugu, Public Speaking"},
    {"n": "Roshan D", "h": "Swimming (Expert), Water Safety (Intermediate)", "w": "Lifeguard Training, Endurance Training"},
    {"n": "Bhavana Rao", "h": "Lifeguard Skills (Expert), Emergency Rescue (Intermediate)", "w": "Advanced Swimming, Coaching Skills"},
    {"n": "Sahil Malviya", "h": "Photography Lighting (Expert), Studio Setup (Intermediate)", "w": "Portrait Posing, Fashion Shoots"},
    {"n": "Tanya Arora", "h": "Fashion Posing (Expert), Modeling Basics (Intermediate)", "w": "Lighting Techniques, Editorial Photography"},
    {"n": "Ashok N", "h": "Carpentry (Expert), Home Repairs (Intermediate)", "w": "Tool Maintenance, DIY Projects"},
    {"n": "Mehul Shah", "h": "Tool Maintenance (Expert), Safety Procedures (Intermediate)", "w": "Carpentry, Wood Design"},
    {"n": "Nisha B", "h": "Art Therapy (Expert), Emotional Wellness (Intermediate)", "w": "Counseling Basics, Psychology"},
    {"n": "Arvind Menon", "h": "Psychology Basics (Expert), Behavioral Analysis (Intermediate)", "w": "Therapy Techniques, Emotional Intelligence"},
    {"n": "Rupal Jain", "h": "Fashion Styling (Expert), Color Matching (Intermediate)", "w": "Personal Branding, Image Consulting"},
    {"n": "Kunal Mehta", "h": "Personal Branding (Expert), Social Presence (Intermediate)", "w": "Fashion Styling, Visual Aesthetics"},
    {"n": "Sreeram P", "h": "Mechanical Drawing (Expert), Technical Sketching (Intermediate)", "w": "CAD Software, 3D Design"},
    {"n": "Aparna K", "h": "CAD Design (Expert), 3D Modeling (Intermediate)", "w": "Manual Drafting, Engineering Drawing"},
    {"n": "Mohit Rawat", "h": "Street Photography (Expert), Visual Observation (Intermediate)", "w": "Photo Storytelling, Editing Styles"},
    {"n": "Rekha S", "h": "Photo Storytelling (Expert), Narrative Editing (Intermediate)", "w": "Camera Techniques, Outdoor Shoots"},
    {"n": "Sandeep L", "h": "Ethical Hacking Basics (Intermediate), Cyber Awareness (Expert)", "w": "Network Security, Pen Testing"},
    {"n": "Pavithra R", "h": "Network Security (Expert), Risk Assessment (Intermediate)", "w": "Cyber Law, Ethical Practices"},
    {"n": "Akhil Varma", "h": "Debate Coaching (Expert), Critical Thinking (Intermediate)", "w": "Speech Writing, Rhetoric"},
    {"n": "Ankita S", "h": "Speech Writing (Expert), Persuasive Communication (Intermediate)", "w": "Debate Techniques, Public Forums"},
    {"n": "Ravi Teja", "h": "Bike Riding (Expert), Road Navigation (Intermediate)", "w": "Long Ride Planning, Safety Gear Knowledge"},
    {"n": "Poonam K", "h": "Ride Planning (Expert), Safety Equipment (Intermediate)", "w": "Bike Control, Maintenance"},
    {"n": "Sumanth P", "h": "Photography Editing (Expert), Lightroom (Intermediate)", "w": "Cinematic Color Grading, Preset Creation"},
    {"n": "Ishaan Roy", "h": "Color Grading (Expert), Visual Mood Design (Intermediate)", "w": "Editing Workflow, Photo Retouching"},
    {"n": "Kriti Malhotra", "h": "Journaling (Expert), Self Reflection (Intermediate)", "w": "Mind Mapping, Goal Visualization"},
    {"n": "Om Prakash", "h": "Mind Mapping (Expert), Productivity Planning (Intermediate)", "w": "Journaling Techniques, Habit Tracking"},
    {"n": "Sahil D", "h": "Anchoring (Expert), Event Coordination (Intermediate)", "w": "Script Polishing, Voice Control"},
    {"n": "Priti Kulkarni", "h": "Voice Control (Expert), Speech Delivery (Intermediate)", "w": "Stage Hosting, Improvisation"},
    {"n": "Armaan Sheikh", "h": "Mobile Videography (Expert), Shot Composition (Intermediate)", "w": "Storyboarding, Editing Transitions"},
    {"n": "Renu Bala", "h": "Storyboarding (Expert), Visual Planning (Intermediate)", "w": "Camera Angles, Videography Basics"},
    {"n": "Vignesh K", "h": "Mathematics Tutoring (Expert), Concept Simplification (Intermediate)", "w": "Teaching Psychology, Interactive Methods"},
    {"n": "Madhura Deshpande", "h": "Teaching Psychology (Expert), Learning Design (Intermediate)", "w": "Math Tricks, Exam Preparation"},
    {"n": "Sameer N", "h": "Voice Over (Expert), Audio Clarity (Intermediate)", "w": "Dubbing, Sound Effects"},
    {"n": "Jiya Khanna", "h": "Sound Effects (Expert), Audio Mixing (Intermediate)", "w": "Voice Acting, Script Timing"},
    {"n": "Chaitanya Kulkarni", "h": "Critical Analysis (Expert), Logical Reasoning (Intermediate)", "w": "Decision Making, Strategic Planning"},
    {"n": "Anjali Verma", "h": "Strategic Planning (Expert), Decision Making (Intermediate)", "w": "Critical Thinking, Analytical Writing"}
]

for i, u in enumerate(users):
    safe_name = u['n'].lower().replace(" ", ".")
    email = f"{safe_name}@nexus.io"
    password = "123"
    
    # 3. GENERATE SMART HTTPS PROOF LINK
    skill = u['h'].lower()
    if "photo" in skill or "art" in skill or "design" in skill:
        proof = "https://www.behance.net/search/projects?search=portfolio"
    elif "coding" in skill or "python" in skill or "java" in skill or "data" in skill:
        proof = "https://github.com/topics/portfolio"
    elif "video" in skill or "film" in skill:
        proof = "https://vimeo.com/search?q=portfolio"
    elif "writing" in skill or "blog" in skill:
        proof = "https://medium.com/tag/portfolio"
    else:
        proof = "https://linkedin.com/search/results/all/?keywords=" + safe_name
        
    add_user(u['n'], email, password, u['h'], u['w'], proof, credits=30, verified=1)
    print(f"[{i+1}/100] ✅ Added {u['n']} (Proof: {proof})")

print("\n🚀 SUCCESS: Database Reset with HTTPS Links.")