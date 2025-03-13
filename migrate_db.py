import sqlite3
from database import DATABASE

def migrate_database():
    print("Starte Datenbankmigration...")
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Erstelle Backup der aktuellen Datenbank
    cursor.execute("PRAGMA foreign_keys=OFF")
    
    # Migriere food Tabelle
    try:
        print("Migriere food Tabelle...")
        cursor.execute("CREATE TABLE food_new (id INTEGER PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, calories INTEGER NOT NULL, carbs INTEGER NOT NULL, protein INTEGER NOT NULL, fat INTEGER NOT NULL)")
        cursor.execute("INSERT INTO food_new (id, user_id, name, calories, carbs, protein, fat) SELECT id, 'admin', name, calories, carbs, protein, fat FROM food")
        cursor.execute("DROP TABLE food")
        cursor.execute("ALTER TABLE food_new RENAME TO food")
        print("Food Tabelle migriert.")
    except Exception as e:
        print(f"Fehler bei Food-Migration: {e}")
    
    # Migriere daily_entries Tabelle
    try:
        print("Migriere daily_entries Tabelle...")
        cursor.execute("CREATE TABLE daily_entries_new (id INTEGER PRIMARY KEY, user_id TEXT NOT NULL, date TEXT NOT NULL, food_id INTEGER NOT NULL, quantity INTEGER NOT NULL, FOREIGN KEY (food_id) REFERENCES food (id) ON DELETE CASCADE)")
        cursor.execute("INSERT INTO daily_entries_new (id, user_id, date, food_id, quantity) SELECT id, 'admin', date, food_id, quantity FROM daily_entries")
        cursor.execute("DROP TABLE daily_entries")
        cursor.execute("ALTER TABLE daily_entries_new RENAME TO daily_entries")
        print("Daily_entries Tabelle migriert.")
    except Exception as e:
        print(f"Fehler bei Daily-entries-Migration: {e}")
    
    # Migriere goals Tabelle
    try:
        print("Migriere goals Tabelle...")
        cursor.execute("CREATE TABLE goals_new (id INTEGER PRIMARY KEY, user_id TEXT NOT NULL, calories INTEGER NOT NULL, carbs INTEGER NOT NULL, protein INTEGER NOT NULL, fat INTEGER NOT NULL)")
        cursor.execute("INSERT INTO goals_new (id, user_id, calories, carbs, protein, fat) SELECT id, 'admin', calories, carbs, protein, fat FROM goals")
        cursor.execute("DROP TABLE goals")
        cursor.execute("ALTER TABLE goals_new RENAME TO goals")
        print("Goals Tabelle migriert.")
    except Exception as e:
        print(f"Fehler bei Goals-Migration: {e}")
    
    # Migriere exercise_entries Tabelle
    try:
        print("Migriere exercise_entries Tabelle...")
        cursor.execute("CREATE TABLE exercise_entries_new (id INTEGER PRIMARY KEY, user_id TEXT NOT NULL, date TEXT NOT NULL, exercise_id INTEGER NOT NULL, reps INTEGER NOT NULL, sets INTEGER NOT NULL, kg REAL NOT NULL, FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE)")
        cursor.execute("INSERT INTO exercise_entries_new (id, user_id, date, exercise_id, reps, sets, kg) SELECT id, 'admin', date, exercise_id, reps, sets, kg FROM exercise_entries")
        cursor.execute("DROP TABLE exercise_entries")
        cursor.execute("ALTER TABLE exercise_entries_new RENAME TO exercise_entries")
        print("Exercise_entries Tabelle migriert.")
    except Exception as e:
        print(f"Fehler bei Exercise-entries-Migration: {e}")
    
    # Aktiviere foreign keys wieder
    cursor.execute("PRAGMA foreign_keys=ON")
    
    conn.commit()
    conn.close()
    print("Datenbankmigration abgeschlossen!")

if __name__ == "__main__":
    migrate_database()