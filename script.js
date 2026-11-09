// ZAUJÍMAVOSTI O AI

const fakty = [
    "Prvý chatbot ELIZA vznikol už v roku 1966.",
    "AI dokáže generovať obrázky, videá aj hudbu.",
    "Umelá inteligencia sa využíva pri diagnostike chorôb.",
    "Navigácie používajú AI na plánovanie trás.",
    "Moderné prekladače využívajú neurónové siete."
];

function zobrazFakt() {

    const index = Math.floor(Math.random() * fakty.length);

    document.getElementById("fakt").textContent =
        fakty[index];
}


// POČASIE

const weatherForm = document.getElementById("weatherForm");

if(weatherForm){

    weatherForm.addEventListener("submit", async function(e){

        e.preventDefault();

        const city =
            document.getElementById("city").value;

        const result =
            document.getElementById("weatherResult");

        const forecast =
            document.getElementById("forecast");

        if(city.trim() === ""){

            result.innerHTML =
                "<p style='color:red;'>Zadajte názov mesta.</p>";

            forecast.innerHTML = "";

            return;
        }

        try{

            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=sk&format=json`
            );

            const geoData =
                await geoResponse.json();

            if(!geoData.results){

                result.innerHTML =
                    "<p style='color:red;'>Mesto nebolo nájdené.</p>";

                forecast.innerHTML = "";

                return;
            }

            const latitude =
                geoData.results[0].latitude;

            const longitude =
                geoData.results[0].longitude;

            const cityName =
                geoData.results[0].name;

            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
            );

            const weatherData =
                await weatherResponse.json();

            const currentTemp =
                weatherData.current.temperature_2m;

            const currentDate =
                new Date(weatherData.current.time);

            result.innerHTML = `
                <h3>${cityName}</h3>
                <p><strong>Dátum:</strong>
                ${currentDate.toLocaleDateString("sk-SK")}</p>

                <p><strong>Čas:</strong>
                ${currentDate.toLocaleTimeString("sk-SK")}</p>

                <p><strong>Aktuálna teplota:</strong>
                ${currentTemp} °C</p>
            `;

            let forecastHTML =
                "<h3 style='margin-bottom:15px;'>Predpoveď na 7 dní</h3>";

            forecastHTML +=
                "<div class='forecast-grid'>";

            for(let i = 0; i < 7; i++){

                const date =
                    new Date(weatherData.daily.time[i]);

                const max =
                    weatherData.daily.temperature_2m_max[i];

                const min =
                    weatherData.daily.temperature_2m_min[i];

                forecastHTML += `
                    <div class="day-card">

                        <h4>
                            ${date.toLocaleDateString("sk-SK")}
                        </h4>

                        <p>⬆️ ${max} °C</p>

                        <p>⬇️ ${min} °C</p>

                    </div>
                `;
            }

            forecastHTML += "</div>";

            forecast.innerHTML =
                forecastHTML;

        }
        catch(error){

            result.innerHTML =
                "<p style='color:red;'>Chyba pri načítaní údajov.</p>";

            forecast.innerHTML = "";

            console.error(error);

        }

    });

}