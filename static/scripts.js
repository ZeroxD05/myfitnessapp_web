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

// Toggle-Funktion für die Ernährung
const toggleNutritionButton = document.getElementById("toggle-nutrition");
const nutritionContent = document.getElementById("nutrition-content");

if (toggleNutritionButton && nutritionContent) {
  toggleNutritionButton.addEventListener("click", function () {
    if (
      nutritionContent.style.display === "none" ||
      nutritionContent.style.display === ""
    ) {
      nutritionContent.style.display = "block";
      toggleNutritionButton.innerHTML =
        "Nutrition <i class='bx bx-chevron-up'></i>";
    } else {
      nutritionContent.style.display = "none";
      toggleNutritionButton.innerHTML =
        "Nutrition <i class='bx bx-chevron-down'></i>";
    }
  });
}
// Toggle-Funktion für die Diets
const toggleDietsButton = document.getElementById("toggle-diets");
const dietsContent = document.getElementById("diets-content");

if (toggleDietsButton && dietsContent) {
  toggleDietsButton.addEventListener("click", function () {
    if (
      dietsContent.style.display === "none" ||
      dietsContent.style.display === ""
    ) {
      dietsContent.style.display = "block";
      toggleDietsButton.innerHTML = "Diets <i class='bx bx-chevron-up'></i>";
    } else {
      dietsContent.style.display = "none";
      toggleDietsButton.innerHTML = "Diets <i class='bx bx-chevron-down'></i>";
    }
  });
}

const diets = {
  keto: {
    title: "Ketogenic Diet 🥑",
    content:
      "The ketogenic diet is a very low-carbohydrate, high-fat diet. It reduces blood sugar and insulin levels and shifts the body's metabolism away from carbohydrates towards fats and ketones. 🌟",
    color: "#ffcc00", // Gelb, passend zu Avocado
  },
  vegan: {
    title: "Vegan Diet 🥦",
    content:
      "A vegan diet excludes all animal products and is based on plant-based foods. This can lead to an increased intake of fiber and a reduced risk of certain diseases. 🌿",
    color: "#4caf50", // Grün, passend zu pflanzlicher Ernährung
  },
  paleo: {
    title: "Paleo Diet 🍖",
    content:
      "The Paleo diet is based on the presumed eating habits of early human ancestors and includes meat, fish, fruits, vegetables, nuts, and seeds, while avoiding processed foods, sugar, and grains. 🥥",
    color: "#8d6e63", // Brauntöne, passend zu natürlichen Lebensmitteln
  },
  mediterranean: {
    title: "Mediterranean Diet 🫒",
    content:
      "The Mediterranean diet emphasizes fruits, vegetables, whole grains, and healthy fats like olive oil. It promotes heart health and has been linked to reduced risk of chronic diseases. 🌞",
    color: "#f5b041", // Orange, passend zu mediterranen Zutaten
  },
  intermittent_fasting: {
    title: "Intermittent Fasting ⏳",
    content:
      "Intermittent fasting alternates between periods of eating and fasting. It can help with weight loss, improve metabolism, and has various health benefits. ⚖️",
    color: "#2196f3", // Blau, passend zu ausgewogenem Lebensstil
  },
};

document.querySelectorAll(".diet-button").forEach((button) => {
  button.addEventListener("click", function () {
    const dietKey = this.getAttribute("data-diet");
    const diet = diets[dietKey];
    let contentSection = this.nextElementSibling;

    if (
      !contentSection ||
      !contentSection.classList.contains("content-section")
    ) {
      contentSection = document.createElement("div");
      contentSection.classList.add("content-section");
      contentSection.innerHTML = `<h1>${diet.title}</h1><p>${diet.content}</p>`;
      this.parentNode.insertBefore(contentSection, this.nextSibling);
    }

    if (
      contentSection.style.display === "none" ||
      contentSection.style.display === ""
    ) {
      contentSection.style.display = "block";
      this.innerHTML = `${diet.title} <i class='bx bx-chevron-up'></i>`;
    } else {
      contentSection.style.display = "none";
      this.innerHTML = `${diet.title} <i class='bx bx-chevron-down'></i>`;
    }
  });
});
function showInfo() {
  const tooltip = document.getElementById("infoTooltip");
  if (tooltip) {
    tooltip.style.opacity = 1;
    tooltip.style.display = "block";
    setTimeout(() => {
      tooltip.style.opacity = 0;
      setTimeout(() => {
        tooltip.style.display = "none";
      }, 500); // Match the timeout to the opacity transition duration
    }, 3000); // Tooltip visible for 3 seconds
  }
}
