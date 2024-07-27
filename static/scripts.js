document.addEventListener("DOMContentLoaded", function () {
  // Löschen von Übungseinträgen
  document.querySelectorAll(".delete-exercise").forEach(function (button) {
    button.addEventListener("click", function () {
      var entryId = this.getAttribute("data-id");

      fetch(`/delete_exercise_entry/${entryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            var row = this.closest(".exercise-entry");
            if (row) {
              //row.parentNode.removeChild(row);
              let date = document.getElementById(`date-${parseInt(entryId)}`);
              date.parentNode.removeChild(date);
            }
          } else {
            console.error("Error.");
          }
        })
        .catch((error) => console.error("Fehler:", error));
    });
  });

  // Löschen von Lebensmitteln
  document.querySelectorAll(".delete-food").forEach(function (button) {
    button.addEventListener("click", function () {
      var itemId = this.getAttribute("data-id");

      fetch(`/delete_food/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            var listItem = this.closest("li");
            if (listItem) {
              listItem.parentNode.removeChild(listItem);
            }
          } else {
            console.error("Error");
          }
        })
        .catch((error) => console.error("Fehler:", error));
    });
  });

  // Toggle-Funktion für das Formular
  const toggleFormButton = document.getElementById("toggle-form");
  const formContent = document.getElementById("form-content");

  if (toggleFormButton && formContent) {
    toggleFormButton.addEventListener("click", function () {
      if (
        formContent.style.display === "none" ||
        formContent.style.display === ""
      ) {
        formContent.style.display = "block";
        toggleFormButton.innerHTML =
          "Hide Form <i class='bx bx-chevron-up'></i>";
      } else {
        formContent.style.display = "none";
        toggleFormButton.innerHTML =
          "Set Goals <i class='bx bx-chevron-down'></i>";
      }
    });
  }

  // Toggle-Funktion für die Ziele
  const toggleGoalsButton = document.getElementById("toggle-goals");
  const goalsContent = document.getElementById("goals-content");

  if (toggleGoalsButton && goalsContent) {
    toggleGoalsButton.addEventListener("click", function () {
      if (
        goalsContent.style.display === "none" ||
        goalsContent.style.display === ""
      ) {
        goalsContent.style.display = "block";
        toggleGoalsButton.innerHTML = "Notes <i class='bx bx-chevron-up'></i>";
      } else {
        goalsContent.style.display = "none";
        toggleGoalsButton.innerHTML =
          "Notes <i class='bx bx-chevron-down'></i>";
      }
    });
  }

  // Such- und Ergebnislogik
  const resultsContainer = document.getElementById("results");
  const deleteResultsButton = document.createElement("button");
  deleteResultsButton.className = "delete-food";
  deleteResultsButton.textContent = "Delete";

  function initializeState() {
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedQuery) {
      searchInput.value = savedQuery;
      displayResults(savedQuery);
    }
  }

  function showSuggestions(value) {
    suggestionsContainer.innerHTML = "";
    if (value) {
      const lowerCaseValue = value.toLowerCase();
      const suggestions = Object.keys(nutritionData).filter((item) =>
        item.includes(lowerCaseValue)
      );
      suggestions.forEach((suggestion) => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.textContent = capitalizeFirstLetter(suggestion);
        div.addEventListener("click", () => {
          searchInput.value = capitalizeFirstLetter(suggestion);
          suggestionsContainer.innerHTML = "";
          displayResults(suggestion);
        });
        suggestionsContainer.appendChild(div);
      });
    }
  }

  function displayResults(query) {
    const lowerCaseQuery = query.toLowerCase();
    const data = nutritionData[lowerCaseQuery];
    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(deleteResultsButton); // Füge den Delete-Button hinzu
    if (data) {
      resultsContainer.innerHTML += `
        <h2>${capitalizeFirstLetter(query)}:</h2>
        <p><strong>Kcal:</strong> ${data.calories} kcal</p>
        <p><strong>Protein:</strong> ${data.protein} g</p>
        <p><strong>Fat:</strong> ${data.fat} g</p>
        <p><strong>Carbs:</strong> ${data.carbohydrates} g</p>
      `;
      resultsContainer.style.display = "block"; // Zeige den Ergebnisse-Container
      localStorage.setItem("searchQuery", query); // Speichere die Suchanfrage
    } else {
      resultsContainer.innerHTML += `
        <p>Nothing found. Please try again.</p>
      `;
      resultsContainer.style.display = "block"; // Zeige den Ergebnisse-Container
      localStorage.setItem("searchQuery", query); // Speichere die Suchanfrage
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  initializeState();

  // clearButton.addEventListener("click", () => {
  //   searchInput.value = "";
  //   suggestionsContainer.innerHTML = "";
  //   resultsContainer.innerHTML = "";
  //   resultsContainer.style.display = "none"; // Verstecke den Ergebnisse-Container
  //   localStorage.removeItem("searchQuery"); // Entferne die gespeicherte Suchanfrage
  // });

  deleteResultsButton.addEventListener("click", () => {
    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "none"; // Verstecke den Ergebnisse-Container
    localStorage.removeItem("searchQuery"); // Entferne die gespeicherte Suchanfrage
  });

  // Event Listener für den Hide-Button
  const hideButtons = document.querySelectorAll(".exercise-entry button");
  hideButtons.forEach((button) => {
    button.addEventListener("click", function () {
      this.closest(".exercise-entry").style.display = "none";
    });
  });

  // Progressbar und Kalorien-Berechnung
  const progressBar = document.getElementById("progress");
  const calorieInput = document.getElementById("calorie-input");
  const addCaloriesBtn = document.getElementById("add-calories-btn");
  const caloriesConsumedElement = document.getElementById("calories-consumed");
  const caloriesGoalElement = document.getElementById("calories-goal");
  const percentageElement = document.getElementById("percentage");
  const calculateBtn = document.getElementById("calculate-btn");
  const ageInput = document.getElementById("age");
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");
  const activityLevelInput = document.getElementById("activity-level");
  let goal = 2000; // Calorie goal
  let caloriesConsumed = 0;

  function updateHealthBar() {
    const percentage = (caloriesConsumed / goal) * 100;
    progressBar.style.width = `${Math.min(percentage, 100)}%`; // Cap at 100%
    caloriesConsumedElement.textContent = `${caloriesConsumed} kcal`;
    percentageElement.textContent = `${Math.min(percentage, 100).toFixed(2)}%`;
  }

  addCaloriesBtn.addEventListener("click", function () {
    const calorieValue = parseInt(calorieInput.value);
    if (!isNaN(calorieValue)) {
      caloriesConsumed += calorieValue;
      updateHealthBar();
    }
  });

  calculateBtn.addEventListener("click", function () {
    const age = parseInt(ageInput.value);
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    const activityLevel = parseFloat(activityLevelInput.value);
    if (
      !isNaN(age) &&
      !isNaN(weight) &&
      !isNaN(height) &&
      !isNaN(activityLevel)
    ) {
      const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      const dailyCalories = bmr * activityLevel;
      caloriesGoalElement.textContent = `${Math.round(dailyCalories)} kcal`;
      goal = dailyCalories;
      updateHealthBar();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Lade Notizen beim Laden der Seite
  loadNotes();
});

document.getElementById("add-note").addEventListener("click", function () {
  var noteInput = document.getElementById("note-input");
  var noteText = noteInput.value.trim();
  if (noteText !== "") {
    addNoteToList(noteText);
    noteInput.value = ""; // Leere das Eingabefeld
    saveNotes(); // Speichere die Notizen im Local Storage
  }
});

function addNoteToList(noteText) {
  var noteList = document.getElementById("note-list");

  var note = document.createElement("div");
  note.className = "note";
  note.innerHTML =
    "<p>" + noteText + '</p><button class="delete-button">Delete</button>';

  note.querySelector(".delete-button").addEventListener("click", function () {
    noteList.removeChild(note);
    saveNotes(); // Aktualisiere Local Storage nach Löschen
  });

  noteList.appendChild(note);
}

function saveNotes() {
  var notes = [];
  document.querySelectorAll(".note p").forEach(function (noteElement) {
    notes.push(noteElement.textContent);
  });
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  var notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.forEach(function (noteText) {
    addNoteToList(noteText);
  });
}

// Toggle Blog Content
document.getElementById("toggle-blog").addEventListener("click", () => {
  const blogContent = document.getElementById("blog-content");
  if (
    blogContent.style.display === "none" ||
    blogContent.style.display === ""
  ) {
    blogContent.style.display = "block";
  } else {
    blogContent.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var coll = document.getElementsByClassName("collapsible");
  for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
});

function togglePopup() {
  const popup = document.getElementById("popup");
  const isVisible = popup.style.display === "block";
  popup.style.display = isVisible ? "none" : "block";
}

function changeLanguage(language) {
  // Beispiel: Speichern Sie die Sprache in einem Cookie oder lokalem Speicher
  document.cookie = `language=${language};path=/`;

  // Hier sollten Sie den Code hinzufügen, um die Sprache der App tatsächlich zu ändern
  alert(`Sprache geändert zu ${language === "de" ? "Deutsch" : "Englisch"}`);
}

function logout() {
  // Hier sollte der Code hinzugefügt werden, um den Benutzer abzumelden
  alert("Sie wurden abgemeldet.");
}
