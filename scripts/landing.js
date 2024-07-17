document.addEventListener("DOMContentLoaded", function() {
  const toggleMenu = document.querySelector(".toggle-menu");
  const navUl = document.querySelector("nav ul");
  const getStartBtn = document.getElementById("get-start-btn");
  const discoverNowBtn = document.getElementById("discover-now-btn");

  // Toggle the menu on click of the toggle icon
  toggleMenu.addEventListener("click", function(event) {
      navUl.classList.toggle("show-menu");
      event.stopPropagation();  // Prevent event from bubbling up to document
  });

  // Hide the menu when clicking outside of it
  document.addEventListener("click", function(event) {
      if (!navUl.contains(event.target) && navUl.classList.contains("show-menu")) {
          navUl.classList.remove("show-menu");
      }
  });

  // Hide the menu when clicking on a menu item
  navUl.querySelectorAll("li").forEach(function(menuItem) {
      menuItem.addEventListener("click", function() {
          navUl.classList.remove("show-menu");
      });
  });
  
  // Open search.html in a new tab on Get Started button click
  getStartBtn.addEventListener("click", function() {
      window.open("./search.html", "_blank");
  });

  // Open search.html in a new tab on Discover Now button click
  discoverNowBtn.addEventListener("click", function() {
      window.open("./search.html", "_blank");
  });
});

// Slider
let currentOpinion = 0;
const opinions = document.querySelectorAll('.opinion-item');
const totalOpinions = opinions.length;

function showOpinion(index) {
    opinions.forEach(opinion => {
        opinion.style.display = 'none';
    });
    opinions[index].style.display = 'block';
}

function nextOpinion() {
    currentOpinion = (currentOpinion + 1) % totalOpinions;
    showOpinion(currentOpinion);
}

// Initial display
showOpinion(currentOpinion);

// Automatically transition to the next opinion every 5 seconds (adjust as needed)
setInterval(nextOpinion, 4000);
