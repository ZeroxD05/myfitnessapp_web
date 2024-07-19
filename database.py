import sqlite3

def create_database():
    conn = sqlite3.connect('myfitnessapp.db')
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
                    FOREIGN KEY (food_id) REFERENCES food (id)
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
                    FOREIGN KEY (exercise_id) REFERENCES exercises (id)
                )''')
    
    # Add default exercises if the table is empty
    c.execute("SELECT COUNT(*) FROM exercises")
    if c.fetchone()[0] == 0:
        default_exercises = [
            'Bench Press',
            'Bicep Curls',
            'Tricep Pushdown',
            'Calf Raises',
            'Squats',
            'Lat Pulldown',
            'Deadlift',
            'Overhead Press',
            'Lunges',
            'Rows'
        ]
        for exercise in default_exercises:
            c.execute("INSERT INTO exercises (name) VALUES (?)", (exercise,))
    
    conn.commit()
    conn.close()

def add_food(name, calories, carbs, protein, fat):
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("INSERT INTO food (name, calories, carbs, protein, fat) VALUES (?, ?, ?, ?, ?)",
              (name, calories, carbs, protein, fat))
    conn.commit()
    conn.close()

def get_food():
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("SELECT * FROM food")
    rows = c.fetchall()
    conn.close()
    return rows

def add_entry(date, food_id, quantity):
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("INSERT INTO daily_entries (date, food_id, quantity) VALUES (?, ?, ?)",
              (date, food_id, quantity))
    conn.commit()
    conn.close()

def get_entries():
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("SELECT date, name, quantity, calories, carbs, protein, fat FROM daily_entries JOIN food ON daily_entries.food_id = food.id")
    rows = c.fetchall()
    conn.close()
    return rows

def add_exercise(name):
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("INSERT INTO exercises (name) VALUES (?)", (name,))
    conn.commit()
    conn.close()

def get_exercises():
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("SELECT * FROM exercises")
    rows = c.fetchall()
    conn.close()
    return rows

def add_exercise_entry(date, exercise_id, reps, sets, kg):
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("INSERT INTO exercise_entries (date, exercise_id, reps, sets, kg) VALUES (?, ?, ?, ?, ?)",
              (date, exercise_id, reps, sets, kg))
    conn.commit()
    conn.close()

def get_exercise_entries():
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("SELECT date, exercises.name, reps, sets, kg, (reps * sets * kg) as total_weight "
              "FROM exercise_entries JOIN exercises ON exercise_entries.exercise_id = exercises.id")
    rows = c.fetchall()
    conn.close()
    return rows

def set_goals(calories, carbs, protein, fat):
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("DELETE FROM goals")
    c.execute("INSERT INTO goals (calories, carbs, protein, fat) VALUES (?, ?, ?, ?)",
              (calories, carbs, protein, fat))
    conn.commit()
    conn.close()

def get_goals():
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("SELECT * FROM goals")
    goals = c.fetchone()
    conn.close()
    return goals
