from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from database import create_database, add_food, get_food, add_exercise_entry, get_exercise_entries, add_exercise, get_exercises, set_goals, get_goals, add_user, get_user
from datetime import datetime
import sqlite3

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Ändere dies in einen echten geheimen Schlüssel

create_database()

@app.route('/')
def index():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if get_user(username):
            flash("Username already exists", 'error')
            return redirect(url_for('register'))
        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        add_user(username, hashed_password)
        flash("Registration successful! Please log in.", 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = get_user(username)
        if not user or not check_password_hash(user['password'], password):
            flash("Invalid username or password", 'error')
            return redirect(url_for('login'))
        
        session['username'] = username
        return redirect(url_for('index'))  # Weiterleitung zur Index-Seite nach erfolgreichem Login
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/food', methods=['GET', 'POST'])
def food():
    if request.method == 'POST':
        name = request.form.get('name')
        calories = request.form.get('calories')
        carbs = request.form.get('carbs')
        protein = request.form.get('protein')
        fat = request.form.get('fat')

        if not all([name, calories, carbs, protein, fat]):
            flash("Bitte alle Felder ausfüllen", 'error')
            return redirect(url_for('food'))

        try:
            add_food(name, int(calories), int(carbs), int(protein), int(fat))
            flash("Lebensmittel hinzugefügt", 'success')
        except ValueError:
            flash("Fehler beim Hinzufügen des Lebensmittels. Überprüfe die Eingaben.", 'error')
        return redirect(url_for('food'))

    foods = get_food()
    return render_template('food.html', foods=foods)

@app.route('/exercise_entries', methods=['GET', 'POST'])
def exercise_entries():
    if request.method == 'POST':
        date_entry = datetime.now().strftime('%y-%m-%d')
        exercise_id = request.form.get('exercise_id')
        reps = request.form.get('reps')
        sets = request.form.get('sets')
        kg = request.form.get('kg')

        if not all([exercise_id, reps, sets, kg]):
            flash("Fill out all fields", 'error')
            return redirect(url_for('exercise_entries'))

        try:
            add_exercise_entry(date_entry, int(exercise_id), int(reps), int(sets), float(kg))
            flash("Added", 'success')
        except ValueError:
            flash("Error", 'error')
        return redirect(url_for('exercise_entries'))

    exercises = get_exercises()
    entries = get_exercise_entries()
    return render_template('exercise_entries.html', exercises=exercises, entries=entries)

@app.route('/goals', methods=['GET', 'POST'])
def goals():
    if request.method == 'POST':
        gender = request.form.get('gender')
        age = request.form.get('age')
        weight = request.form.get('weight')
        height = request.form.get('height')
        activity_level = request.form.get('activity_level')

        if not all([gender, age, weight, height, activity_level]):
            flash("Fill out all fields", 'error')
            return redirect(url_for('goals'))

        try:
            age = int(age)
            weight = float(weight)
            height = float(height)
            activity_level = float(activity_level)
        except ValueError:
            flash("Error", 'error')
            return redirect(url_for('goals'))

        if gender == 'male':
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161

        daily_calories = bmr * activity_level
        calories_goal = round(daily_calories)
        carbs_goal = round(calories_goal * 0.5)
        protein_goal = round(calories_goal * 0.3)
        fat_goal = round(calories_goal * 0.2)

        set_goals(calories_goal, carbs_goal, protein_goal, fat_goal)
        flash("Added goal", 'success')
        return redirect(url_for('goals'))

    goals = get_goals()
    return render_template('goals.html', goals=goals)

@app.route('/delete_food/<int:item_id>', methods=['DELETE'])
def delete_food(item_id):
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("DELETE FROM food WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return '', 204

@app.route('/delete_exercise_entry/<int:entry_id>', methods=['DELETE'])
def delete_exercise_entry(entry_id):
    conn = sqlite3.connect('myfitnessapp.db')
    c = conn.cursor()
    c.execute("DELETE FROM exercise_entries WHERE id = ?", (entry_id,))
    conn.commit()
    conn.close()
    return '', 204

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
