// JavaScript (scripts.js)

// Formularvalidierung
function validateForm() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return false;
  }

  // Zusätzliche Validierungslogik kann hier hinzugefügt werden

  return true;
}

// Bildergalerie Beispiel
const images = document.querySelectorAll(".image-gallery img");

images.forEach((img) => {
  img.addEventListener("click", () => {
    // Beispiel: Öffnen eines Modals oder Ausführen einer Aktion mit dem angeklickten Bild
    console.log("Clicked on image:", img.alt);
  });
});

// Automatische Bildergalerie
const gallery = document.querySelector(".image-gallery");
let currentIndex = 0;
const slideWidth = images[0].clientWidth; // Breite eines einzelnen Bildes

function slideGallery() {
  currentIndex++;
  if (currentIndex >= images.length) {
    currentIndex = 0;
  }

  const offset = -1 * currentIndex * slideWidth;
  gallery.style.transform = `translateX(${offset}px)`;
}

setInterval(slideGallery, 3000); // Ändern Sie 3000 für die Geschwindigkeit der Animation (in Millisekunden)

// JavaScript für das Einfladen der Features beim Scrollen
document.addEventListener("DOMContentLoaded", function () {
  const features = document.querySelectorAll(".feature");

  function checkScroll() {
    features.forEach((feature) => {
      const featurePosition = feature.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;

      if (featurePosition < viewportHeight * 0.75) {
        feature.classList.add("active");
      }
    });
  }

  // Initialer Check beim Laden der Seite
  checkScroll();

  // Event Listener für das Scrollen hinzufügen
  window.addEventListener("scroll", checkScroll);
});

document.addEventListener("DOMContentLoaded", function () {
  const features = document.querySelectorAll(".feature");
  const footer = document.querySelector(".footer-container");

  function checkScroll() {
    const viewportHeight = window.innerHeight;

    features.forEach((feature) => {
      const featurePosition = feature.getBoundingClientRect().top;
      if (featurePosition < viewportHeight * 0.75) {
        feature.classList.add("active");
      }
    });

    // Check if user has scrolled down 100px to display the footer
    if (window.scrollY > 100) {
      footer.classList.add("visible");
    } else {
      footer.classList.remove("visible");
    }
  }

  // Initial check when the page loads
  checkScroll();

  // Add event listener for scroll
  window.addEventListener("scroll", checkScroll);
});

document.addEventListener("DOMContentLoaded", function () {
  const features = document.querySelectorAll(".feature");
  const footer = document.querySelector(".footer-container");

  function checkScroll() {
    const viewportHeight = window.innerHeight;

    features.forEach((feature) => {
      const featurePosition = feature.getBoundingClientRect().top;
      if (featurePosition < viewportHeight * 0.75) {
        feature.classList.add("active");
      }
    });

    if (window.scrollY > 100) {
      footer.classList.add("visible");
    } else {
      footer.classList.remove("visible");
    }
  }

  checkScroll();
  window.addEventListener("scroll", checkScroll);
});

document.addEventListener("DOMContentLoaded", function () {
  const features = document.querySelectorAll(".feature");
  const footer = document.querySelector(".footer-container");

  function checkScroll() {
    const viewportHeight = window.innerHeight;

    features.forEach((feature) => {
      const featurePosition = feature.getBoundingClientRect().top;
      if (featurePosition < viewportHeight * 0.75) {
        feature.classList.add("active");
      }
    });

    if (window.scrollY > 100) {
      footer.classList.add("visible");
    } else {
      footer.classList.remove("visible");
    }
  }

  checkScroll();
  window.addEventListener("scroll", checkScroll);

  // Smooth scrolling to the "Get the App" button
  const footerButtons = document.querySelectorAll(".footer-btn");

  footerButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const target = document.querySelector("#get-the-app");
      const offsetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight / 2 +
        target.offsetHeight / 2;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  });
});
