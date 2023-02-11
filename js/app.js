const container = document.querySelector(".container");
const result = document.querySelector("#resultado");
const form = document.querySelector("#formulario");

window.addEventListener("load", () => {
  form.addEventListener("submit", searchWeather);
});

function searchWeather(e) {
  e.preventDefault();
  // Validar Formulario
  const city = document.querySelector("#ciudad").value;
  const country = document.querySelector("#pais").value;

  if (city === "" || country === "") {
    // Error
    showError("both fields are required!");
    return;
  }
  console.log(`Searching weather in... ${city} ${country}`);

  consultingAPI(city, country);
}

function showError(message) {
  console.log(message);
  const alert = document.querySelector(".bg-red-100");

  if (!alert) {
    // Create alert
    const alert = document.createElement("div");
    alert.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alert.innerHTML = `
    <strong>Error!</strong>
    <span class="block">${message}</span>
  `;

    container.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 4000);
  }
}

function consultingAPI(city, country) {
  const appId = "c9074ca4f9229b6e7c87e97a074d557b";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${appId}`;
  spinner();

  setTimeout(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        cleanHTML();

        if (data.cod === "404") {
          showError("City not found...");
          return;
        } else {
          showData(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, 2000);
}

function showData(data) {
  // ATTENTION: The api temp response are kelvin degrees.
  const {
    main: { temp, temp_max, temp_min },
    name,
    sys: { country },
  } = data;

  const place = document.createElement("p");
  place.innerText = `${name}, ${country}`;
  place.classList.add("font-bold", "text-4xl");

  // HELPER FUNCTION: this are created for a simple action.
  const kelvinACentigrados = (kelvin) => parseInt(kelvin - 273.15);

  const actual = document.createElement("p");
  // We using innerHTML becouse we will to print an html entity
  actual.innerHTML = `${kelvinACentigrados(temp)} &#8451;`;
  actual.classList.add("font-bold", "text-6xl");

  const maxMin = document.createElement("p");
  maxMin.innerHTML = `Max: ${kelvinACentigrados(temp_max)}&#8451;, Min: ${kelvinACentigrados(temp_min)}&#8451;`;
  maxMin.classList.add("font-bold", "text-3xl");

  // CITY NAME
  const placeDiv = document.createElement("div");
  placeDiv.classList.add("text-center", "text-white");
  placeDiv.appendChild(place);
  // TEMPERATURE
  const resultDiv = document.createElement("div");
  resultDiv.classList.add("text-center", "text-white");
  resultDiv.appendChild(actual);

  // TEMP MAX & MIN
  const resultMaxMin = document.createElement("div");
  resultMaxMin.classList.add("text-center", "text-white");
  resultMaxMin.appendChild(maxMin);

  result.appendChild(placeDiv);
  result.appendChild(resultDiv);
  result.appendChild(resultMaxMin);
}

function cleanHTML() {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }
}

function spinner() {
  cleanHTML();

  const spinnerDiv = document.createElement("div");
  spinnerDiv.setAttribute("id", "spinner");
  spinnerDiv.classList.add("flex", "items-center", "justify-center");
  spinnerDiv.innerHTML = `
      <div class="lds-hourglass"></div>
  `;

  result.appendChild(spinnerDiv);
}
