import sqlite3

DATABASE = 'myfitnessapp.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def create_database():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS food (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    calories INTEGER NOT NULL,
                    carbs INTEGER NOT NULL,
                    protein INTEGER NOT NULL,
                    fat INTEGER NOT NULL
                )''')
    c.execute('''CREATE TABLE IF NOT EXISTS daily_entries (
                    id INTEGER PRIMARY KEY,
                    date TEXT NOT NULL,
                    food_id INTEGER NOT NULL,
                    quantity INTEGER NOT NULL,
                    FOREIGN KEY (food_id) REFERENCES food (id) ON DELETE CASCADE
                )''')
    c.execute('''CREATE TABLE IF NOT EXISTS goals (
                    id INTEGER PRIMARY KEY,
                    calories INTEGER NOT NULL,
                    carbs INTEGER NOT NULL,
                    protein INTEGER NOT NULL,
                    fat INTEGER NOT NULL
                )''')
    c.execute('''CREATE TABLE IF NOT EXISTS exercises (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL
                )''')
    c.execute('''CREATE TABLE IF NOT EXISTS exercise_entries (
                    id INTEGER PRIMARY KEY,
                    date TEXT NOT NULL,
                    exercise_id INTEGER NOT NULL,
                    reps INTEGER NOT NULL,
                    sets INTEGER NOT NULL,
                    kg REAL NOT NULL,
                    FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
                )''')
    
    c.execute("SELECT COUNT(*) FROM exercises")
    if c.fetchone()[0] == 0:
        default_exercises = [
             'Bench Press',
        'Incline Bench Press',
        'Decline Bench Press',
        'Chest Flyes',
        'Push-Ups',

        # Schultern
        'Overhead Press',
        'Lateral Raises',
        'Front Raises',
        'Rear Delt Flyes',
        'Arnold Press',

        # Arme
        # Bizeps
        'Bicep Curls',
        'Hammer Curls',
        'Concentration Curls',
        'Preacher Curls',
        # Trizeps
        'Tricep Pushdown',
        'Tricep Dips',
        'Skull Crushers',
        'Overhead Tricep Extension',

        # Rücken
        'Lat Pulldown',
        'Pull-Ups',
        'Bent Over Rows',
        'Deadlift',
        'T-Bar Rows',
        'Seated Rows',
        'Face Pulls',
        'Hyperextensions',

        # Beine
        # Quadrizeps
        'Squats',
        'Leg Press',
        'Lunges',
        'Bulgarian Split Squats',
        # Hamstrings
        'Deadlifts',
        'Leg Curls',
        'Romanian Deadlifts',
        # Waden
        'Calf Raises',
        'Seated Calf Raises',

        # Po
        'Hip Thrusts',
        'Glute Bridges',
        'Donkey Kicks',
        'Step-Ups',
        'Cable Kickbacks',

        # Bauch
        'Crunches',
        'Leg Raises',
        'Planks',
        'Russian Twists',
        'Bicycle Crunches',
        'Hanging Leg Raises',

        # Ganzkörper
        'Burpees',
        'Kettlebell Swings',
        'Battle Ropes'
        ]
        c.executemany("INSERT INTO exercises (name) VALUES (?)", [(exercise,) for exercise in default_exercises])




def add_food(name, calories, carbs, protein, fat):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO food (name, calories, carbs, protein, fat) VALUES (?, ?, ?, ?, ?)",
              (name, calories, carbs, protein, fat))
    conn.commit()
    conn.close()

def get_food():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM food")
    rows = c.fetchall()
    conn.close()
    return rows

def add_exercise(name):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO exercises (name) VALUES (?)", (name,))
    conn.commit()
    conn.close()

def get_exercises():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM exercises")
    rows = c.fetchall()
    conn.close()
    return rows

def add_exercise_entry(date, exercise_id, reps, sets, kg):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO exercise_entries (date, exercise_id, reps, sets, kg) VALUES (?, ?, ?, ?, ?)",
              (date, exercise_id, reps, sets, kg))
    conn.commit()
    conn.close()

def get_exercise_entries():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT date, exercises.name, reps, sets, kg, (reps * sets * kg) as total_weight "
              "FROM exercise_entries JOIN exercises ON exercise_entries.exercise_id = exercises.id")
    rows = c.fetchall()
    conn.close()
    return rows

def set_goals(calories, carbs, protein, fat):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM goals")
    c.execute("INSERT INTO goals (calories, carbs, protein, fat) VALUES (?, ?, ?, ?)",
              (calories, carbs, protein, fat))
    conn.commit()
    conn.close()

def get_goals():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM goals")
    goals = c.fetchone()
    conn.close()
    return goals
