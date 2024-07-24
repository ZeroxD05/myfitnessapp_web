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
            var row = this.closest("tr");
            if (row) {
              row.parentNode.removeChild(row);
            }
          } else {
            console.error("Fehler beim Löschen des Übungseintrags.");
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
            console.error("Fehler beim Löschen des Lebensmittels.");
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
          "Hide Form <i class='bx bx-chevron-up' ></i>";
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
        toggleGoalsButton.innerHTML =
          "Friends <i class='bx bx-chevron-up' ></i>";
      } else {
        goalsContent.style.display = "none";
        toggleGoalsButton.innerHTML =
          "Friends <i class='bx bx-chevron-down'></i>";
      }
    });
  }

  // Such- und Ergebnislogik

  const searchInput = document.getElementById("search-input");
  const suggestionsContainer = document.getElementById("suggestions");
  const resultsContainer = document.getElementById("results");
  const searchButton = document.getElementById("search-button");
  const clearButton = document.getElementById("clear-button");
  const deleteResultsButton = document.createElement("button");
  deleteResultsButton.className = "delete-food";
  deleteResultsButton.textContent = "Delete";

  // Funktion zum Initialisieren des Zustands
  function initializeState() {
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedQuery) {
      searchInput.value = savedQuery;
      displayResults(savedQuery);
    }
  }

  // Funktion zum Anzeigen von Vorschlägen
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

  // Funktion zum Anzeigen von Ergebnissen
  function displayResults(query) {
    const lowerCaseQuery = query.toLowerCase();
    const data = nutritionData[lowerCaseQuery];
    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(deleteResultsButton); // Füge den Delete-Button hinzu
    if (data) {
      resultsContainer.innerHTML += `
        <h2>${capitalizeFirstLetter(query)}:</h2>
        <p><strong>Kalorien:</strong> ${data.calories} kcal</p>
        <p><strong>Eiweiß:</strong> ${data.protein} g</p>
        <p><strong>Fette:</strong> ${data.fat} g</p>
        <p><strong>Kohlenhydrate:</strong> ${data.carbohydrates} g</p>
      `;
      resultsContainer.style.display = "block"; // Zeige den Ergebnisse-Container
      localStorage.setItem("searchQuery", query); // Speichere die Suchanfrage
    } else {
      resultsContainer.innerHTML += `
        <p>Keine Nährwertinformationen gefunden. Bitte versuchen Sie es mit einem anderen Suchbegriff.</p>
      `;
      resultsContainer.style.display = "block"; // Zeige den Ergebnisse-Container
      localStorage.setItem("searchQuery", query); // Speichere die Suchanfrage
    }
  }

  // Funktion zur Formatierung des ersten Buchstabens
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Initialisiere den Zustand beim Laden der Seite
  initializeState();

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    if (query) {
      showSuggestions(query);
    } else {
      suggestionsContainer.innerHTML = "";
      resultsContainer.style.display = "none"; // Verstecke den Ergebnisse-Container, wenn die Suche leer ist
      localStorage.removeItem("searchQuery"); // Entferne die gespeicherte Suchanfrage, wenn das Feld leer ist
    }
  });

  searchButton.addEventListener("click", () => {
    const query = searchInput.value;
    if (query) {
      displayResults(query);
    }
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    suggestionsContainer.innerHTML = "";
    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "none"; // Verstecke den Ergebnisse-Container
    localStorage.removeItem("searchQuery"); // Entferne die gespeicherte Suchanfrage
  });

  // Event Listener für den Delete-Button
  deleteResultsButton.addEventListener("click", () => {
    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "none"; // Verstecke den Ergebnisse-Container
    localStorage.removeItem("searchQuery"); // Entferne die gespeicherte Suchanfrage
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Initialisiere den Zustand
  const additionalButton = document.querySelector("#additional-button");
  const additionalContent = document.querySelector("#additional-content");

  if (additionalButton && additionalContent) {
    additionalButton.addEventListener("click", function () {
      if (
        additionalContent.style.display === "none" ||
        additionalContent.style.display === ""
      ) {
        additionalContent.style.display = "block";
        additionalButton.textContent = "Hide Additional Content"; // Optional: Button-Text ändern
      } else {
        additionalContent.style.display = "none";
        additionalButton.textContent = "Show Additional Content ";

        // Optional: Button-Text ändern
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
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
  const additionalButton = document.getElementById("additional-button");
  const goal = 2000; // Calorie goal
  let caloriesConsumed = 0;

  // Function to update the health bar
  function updateHealthBar() {
    const percentage = (caloriesConsumed / goal) * 100;
    progressBar.style.width = `${Math.min(percentage, 100)}%`; // Cap at 100%
    caloriesConsumedElement.textContent = `${caloriesConsumed} kcal`;
    percentageElement.textContent = `${Math.min(percentage, 100).toFixed(2)}%`;
  }
  // Add calories event
  addCaloriesBtn.addEventListener("click", function () {
    const calorieValue = parseInt(calorieInput.value);
    if (!isNaN(calorieValue)) {
      caloriesConsumed += calorieValue;
      updateHealthBar();
    }
  });

  // Calculate BMR and update the goal
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

  // Toggle additional information
  additionalButton.addEventListener("click", function () {
    const healthBarContainer = document.getElementById("health-bar-container");
    if (
      healthBarContainer.style.display === "none" ||
      !healthBarContainer.style.display
    ) {
      healthBarContainer.style.display = "block";
      additionalButton.textContent = "Hide kcal";
    } else {
      healthBarContainer.style.display = "none";
      additionalButton.textContent = "Show kcal";
    }
  });

  // Initial update
  updateHealthBar();
});
