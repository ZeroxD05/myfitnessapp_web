from flask import Flask, render_template, request, redirect, url_for, flash
from database import create_database, add_food, get_food, add_entry, get_entries, add_exercise, get_exercises, add_exercise_entry, get_exercise_entries, set_goals, get_goals
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Ändere dies in einen echten geheimen Schlüssel

create_database()

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/food', methods=['GET', 'POST'])
def food():
    if request.method == 'POST':
        name = request.form['name']
        calories = request.form['calories']
        carbs = request.form['carbs']
        protein = request.form['protein']
        fat = request.form['fat']

        if not (name and calories and carbs and protein and fat):
            flash("Bitte alle Felder ausfüllen")
            return redirect(url_for('food'))

        add_food(name, int(calories), int(carbs), int(protein), int(fat))
        flash("Lebensmittel hinzugefügt")
        return redirect(url_for('food'))

    foods = get_food()
    return render_template('food.html', foods=foods)

@app.route('/exercise_entries', methods=['GET', 'POST'])
def exercise_entries():
    if request.method == 'POST':
        date_entry = datetime.now().strftime('%Y-%m-%d')  # Aktuelles Datum im Format YYYY-MM-DD
        exercise_id = request.form['exercise_id']
        reps = request.form['reps']
        sets = request.form['sets']
        kg = request.form['kg']

        if not (exercise_id and reps and sets and kg):
            flash("Bitte alle Felder ausfüllen")
            return redirect(url_for('exercise_entries'))

        add_exercise_entry(date_entry, int(exercise_id), int(reps), int(sets), float(kg))
        flash("Sportübung hinzugefügt")
        return redirect(url_for('exercise_entries'))

    exercises = get_exercises()
    entries = get_exercise_entries()
    return render_template('exercise_entries.html', exercises=exercises, entries=entries)

@app.route('/goals', methods=['GET', 'POST'])
def goals():
    if request.method == 'POST':
        gender = request.form['gender']
        age = int(request.form['age'])
        weight = float(request.form['weight'])
        height = float(request.form['height'])
        activity_level = float(request.form['activity_level'])  # Activity factor: 1.2, 1.375, etc.

        if not (gender and age and weight and height and activity_level):
            flash("Bitte alle Felder ausfüllen")
            return redirect(url_for('goals'))

        # Calculate BMR
        if gender == 'male':
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161

        # Calculate daily calories
        daily_calories = bmr * activity_level

        # Set goals based on the calculated daily calories
        calories_goal = round(daily_calories)
        carbs_goal = round(calories_goal * 0.5)  # 50% of calories from carbs
        protein_goal = round(calories_goal * 0.3)  # 30% of calories from protein
        fat_goal = round(calories_goal * 0.2)      # 20% of calories from fat

        set_goals(calories_goal, carbs_goal, protein_goal, fat_goal)
        flash("Ziele gesetzt")
        return redirect(url_for('goals'))

    goals = get_goals()
    return render_template('goals.html', goals=goals)

if __name__ == '__main__':
    app.run(debug=True)
