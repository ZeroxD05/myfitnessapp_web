document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-exercise").forEach((button) => {
    button.addEventListener("click", () => {
      // Dies entfernt das übergeordnete Element des Buttons
      button.parentElement.remove();
    });
  });
});
