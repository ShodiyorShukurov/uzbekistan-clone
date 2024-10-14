async function fetchTours() {
  try {
    const response = await fetch(
      "https://server.usbekistanreise.uz/api/v1/photos"
    );
    const data = await response.json();

    const ul = document.getElementById("tour-list"); 
    data.data.forEach((tour) => {

      const li = document.createElement("li");
      li.classList.add("metall");

      const figure = document.createElement("figure");

      const a = document.createElement("a");
      a.href = tour.image_url; 
      a.classList.add("litebox");

      const img = document.createElement("img");
      img.src = tour.image_url; 
      img.alt = tour.location || "Image"; 
   
      a.appendChild(img);
      figure.appendChild(a);
      li.appendChild(figure);

      
      ul.appendChild(li);
    });
  } catch (error) {
    console.error("Xatolik ma'lumotni olishda:", error);
  }
}

// Sahifa yuklanganda ma'lumotlarni yuklaymiz
window.onload = function () {
  fetchTours();
};
