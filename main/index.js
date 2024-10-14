async function fetchCountries() {
  try {
    const response = await fetch(
      "https://server.usbekistanreise.uz/api/v1/countries"
    );
    const countries = await response.json();

    const ul = document.getElementById("control");

    // "All" tanlovini qo'shamiz
    const allItem = document.createElement("li");
    allItem.classList.add("active");
    allItem.setAttribute("data-filter", "all");
    allItem.textContent = "Alle";

    allItem.addEventListener("click", function () {
      document
        .querySelectorAll("#control li")
        .forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
      countriesData("all"); // 'all' argumenti orqali barcha turlarni yuklaymiz
    });

    ul.appendChild(allItem);

    countries.data.forEach((country) => {
      const li = document.createElement("li");
      li.setAttribute("data-filter", country.id);
      li.textContent = country.name;

      li.addEventListener("click", function () {
        document
          .querySelectorAll("#control li")
          .forEach((item) => item.classList.remove("active"));
        this.classList.add("active");
        const selectedCountryId = this.getAttribute("data-filter");
        countriesData(selectedCountryId);
      });

      ul.appendChild(li);
    });
  } catch (error) {
    console.error("Maʼlumotlarni olishda xatolik yuz berdi:", error);
  }
}

// Fetch tours based on the selected country
async function countriesData(countryId = "all") {
  try {
    const response = await fetch(
      `https://server.usbekistanreise.uz/api/v1/tours/list?country_id=${countryId}`
    );
    const data = await response.json();

    const container = document.getElementById("tours-container");
    container.innerHTML = ""; // Oldingi turlarni tozalash

    data.data.forEach((tour) => {
      const tourHTML = `
                        <div class="col-lg-4 col-md-6 filtr-item" data-category="${tour.country_id}" data-sort="value">
                            <div class="item-single mb-30">
                                <div class="image">
                                    <img src="${tour.main_image_url}" alt="${tour.location}" style="height: 230px">
                                </div>
                                <div class="content">
                                    <span class="location"><i class='bx bx-map'></i>${tour.location}</span>
                                    <h3>
                                        <a  href="#" onclick="handleTourClick('${tour.id}')">
                                            ${tour.day}
                                        </a>
                                    </h3>
                                    <hr>
                                    <a  href="#" onclick="handleTourClick('${tour.id}')">
                                        <button type="button" class="btn btn-outline-dark" onclick="handleTourClick('${tour.id}'); return false;">ZUR REISE ➟</button>
                                    </a>
                                </div>
                                <div class="spacer"></div>
                            </div>
                        </div>
                    `;
      container.innerHTML += tourHTML; // Yaratilgan HTMLni "tours-container" ga qo'shish
    });
  } catch (error) {
    console.error("Xatolik:", error);
  }
}

// Handle tour click event
function handleTourClick(tourId) {
  // LocalStorage ga ID ni saqlash
  localStorage.setItem("selectedTourId", tourId);

  // Tour detailsni yuklash
  fetchTourDetails(tourId);
}

// Fetch tour details based on the tour ID
async function fetchTourDetails(tourId) {
  try {
    const response = await fetch(
      `https://server.usbekistanreise.uz/api/v1/tour/${tourId}`
    );
    const tourData = await response.json();

    const container = document.getElementById("u1");
    container.innerHTML = tourData.data.data; 
  } catch (error) {
    console.error("Xatolik:", error);
  }
}

function handleTourClick(tourId) {
  localStorage.setItem("selectedTourId", tourId); // ID ni localStorage ga saqlash
  window.location.href = "u1.html"; // Yangi sahifaga o'tish
}

  window.onload = function () {
    fetchCountries();
    countriesData();

    const selectedTourId = localStorage.getItem("selectedTourId");
    fetchTourDetails(selectedTourId);

  };


document.getElementById("footerMessage").addEventListener("click", async function (evt) {
  evt.preventDefault();
  // Formadan qiymatlarni olish
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  
  if (!name || !message) {
    alert("Please fill in all fields.");
    return;
  }

  // Yuborish uchun JSON formatda ma'lumot tayyorlash
const requestData = {
  name: name,
  text: message,
};
  console.log(requestData);

  try {
    // Backendga ma'lumot yuborish (URL o'zgarishi mumkin)
    const response = await fetch(
      "https://server.usbekistanreise.uz/api/v1/review/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    ).then((response)=> response.json()).then((data)=> {
      if (data.status === 200) {
                alert("Message sent successfully!");
                document.getElementById("contactForm").reset();
              } else {
                alert("Error sending message. Please try again.");
              }
    })
  } catch (error) {
    console.error("Ma'lumotni yuborishda xatolik:", error);
    alert("Server bilan ulanishda xatolik yuz berdi.");
  }
});
