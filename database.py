import sqlite3

DATABASE = 'myfitnessapp.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def create_database():
    conn = get_db_connection()
    c = conn.cursor()

    # Erstelle die Tabelle für Lebensmittel mit user_id
    c.execute('''CREATE TABLE IF NOT EXISTS food (
                    id INTEGER PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    name TEXT NOT NULL,
                    calories INTEGER NOT NULL,
                    carbs INTEGER NOT NULL,
                    protein INTEGER NOT NULL,
                    fat INTEGER NOT NULL
                )''')

    # Erstelle die Tabelle für tägliche Einträge mit user_id
    c.execute('''CREATE TABLE IF NOT EXISTS daily_entries (
                    id INTEGER PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    date TEXT NOT NULL,
                    food_id INTEGER NOT NULL,
                    quantity INTEGER NOT NULL,
                    FOREIGN KEY (food_id) REFERENCES food (id) ON DELETE CASCADE
                )''')

    # Erstelle die Tabelle für Ziele mit user_id
    c.execute('''CREATE TABLE IF NOT EXISTS goals (
                    id INTEGER PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    calories INTEGER NOT NULL,
                    carbs INTEGER NOT NULL,
                    protein INTEGER NOT NULL,
                    fat INTEGER NOT NULL
                )''')

    # Erstelle die Tabelle für Übungen
    c.execute('''CREATE TABLE IF NOT EXISTS exercises (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL
                )''')

    # Erstelle die Tabelle für Übungseinträge mit user_id
    c.execute('''CREATE TABLE IF NOT EXISTS exercise_entries (
                    id INTEGER PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    date TEXT NOT NULL,
                    exercise_id INTEGER NOT NULL,
                    reps INTEGER NOT NULL,
                    sets INTEGER NOT NULL,
                    kg REAL NOT NULL,
                    FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
                )''')

    # Erstelle die Tabelle für Benutzer
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    username TEXT PRIMARY KEY,
                    password TEXT NOT NULL
                )''')

    # Füge Standardübungen hinzu, wenn die Tabelle leer ist
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

    conn.commit()
    conn.close()

# Funktionen für Benutzer-Management
def add_user(username, password_hash):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password_hash))
    conn.commit()
    conn.close()

def get_user(username):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT password FROM users WHERE username = ?", (username,))
    user = c.fetchone()
    conn.close()
    return user

def delete_user(username):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM users WHERE username = ?", (username,))
    conn.commit()
    conn.close()

# Funktionen für die Verwaltung von Lebensmitteln
def add_food(name, calories, carbs, protein, fat, user_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO food (name, calories, carbs, protein, fat, user_id) VALUES (?, ?, ?, ?, ?, ?)",
              (name, calories, carbs, protein, fat, user_id))
    conn.commit()
    conn.close()

def get_food(user_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM food WHERE user_id = ?", (user_id,))
    rows = c.fetchall()
    conn.close()
    return rows

# Funktionen für die Verwaltung von Übungen
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

# Funktionen für Übungseinträge
def add_exercise_entry(date, exercise_id, reps, sets, kg, user_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO exercise_entries (date, exercise_id, reps, sets, kg, user_id) VALUES (?, ?, ?, ?, ?, ?)",
              (date, exercise_id, reps, sets, kg, user_id))
    conn.commit()
    conn.close()

def get_exercise_entries(user_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT exercise_entries.id, date, exercises.name, reps, sets, kg, (reps * sets * kg) as total_weight "
              "FROM exercise_entries JOIN exercises ON exercise_entries.exercise_id = exercises.id "
              "WHERE exercise_entries.user_id = ?", (user_id,))
    rows = c.fetchall()
    conn.close()
    return rows

# Funktionen für die Verwaltung von Zielen
def set_goals(calories, carbs, protein, fat, user_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM goals WHERE user_id = ?", (user_id,))
    c.execute("INSERT INTO goals (calories, carbs, protein, fat, user_id) VALUES (?, ?, ?, ?, ?)",
              (calories, carbs, protein, fat, user_id))
    conn.commit()
    conn.close()

def get_goals(user_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM goals WHERE user_id = ?", (user_id,))
    goals = c.fetchone()
    conn.close()
    return goals

def get_all_users():
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM users').fetchall()
    conn.close()
    return users

def delete_user(username):
    conn = get_db_connection()
    conn.execute('DELETE FROM users WHERE username = ?', (username,))
    conn.commit()
    conn.close()