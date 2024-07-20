document.addEventListener("DOMContentLoaded", function () {
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
});
