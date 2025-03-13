-- Füge zunächst eine user_id Spalte zu jeder relevanten Tabelle hinzu
ALTER TABLE food ADD COLUMN user_id TEXT;
ALTER TABLE daily_entries ADD COLUMN user_id TEXT;
ALTER TABLE goals ADD COLUMN user_id TEXT;
ALTER TABLE exercise_entries ADD COLUMN user_id TEXT;