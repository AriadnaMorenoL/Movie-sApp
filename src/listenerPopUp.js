const popUp = document.getElementById("media");
popUp.addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    popUp.classList.remove("media--active");
  }
});
