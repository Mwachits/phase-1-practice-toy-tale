document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");
  let addToy = false;

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and display toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToy(toy));
      });
  }

  // Add new toy
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(toyForm);
    const toy = {
      name: formData.get("name"),
      image: formData.get("image"),
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(toy)
    })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy);
      toyForm.reset();
      toyFormContainer.style.display = "none";
      addToy = false;
    });
  });

  // Render a toy card
  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    const likeBtn = toyCard.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      const newLikes = toy.likes + 1;
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ likes: newLikes })
      })
      .then(response => response.json())
      .then(updatedToy => {
        toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        toy.likes = updatedToy.likes; // Update local toy object
      });
    });

    toyCollection.appendChild(toyCard);
  }

  // Initial fetch
  fetchToys();
});
