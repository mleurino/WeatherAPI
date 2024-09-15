const datosClima = document.querySelector(".weather-container");
const formulario= document.querySelector(".get-weather");
const nombreCiudad = document.querySelector("#city");
const nombrePais = document.querySelector("#country");
const buscador = document.querySelector(".buscador");
const borrarHistorial = document.querySelector(".borrar-historial")




formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    
    
    
    if (nombreCiudad && nombrePais) {
        const datosCiudad = `${nombreCiudad.value.trim()}, ${nombrePais.value}`;
        guardarCiudades(datosCiudad);
        mostrarCiudadesGuardadas();
    } else {
        showError('Por favor, complete todos los campos.');
    }



    callAPI(nombreCiudad.value, nombrePais.value);
})


function guardarCiudades(datosCiudad = "Desconocido, Desconocido") {
    let ciudades = JSON.parse(localStorage.getItem('Ciudades')) || [];

    if (ciudades.length === 3) {
        ciudades.shift(); 
    }

    
    if (!ciudades.includes(datosCiudad)) {
        ciudades.push(datosCiudad);

    } 

    localStorage.setItem('Ciudades', JSON.stringify(ciudades));
    
}


function mostrarCiudadesGuardadas() {
    const ciudades = obtenerCiudadesGuardadas();
    const ciudadLista = document.getElementById('lista-ciudades');
    ciudadLista.innerHTML = ''; 
    

    ciudades.forEach(function(city) {
        const li = document.createElement('li');
        li.textContent = city;
        li.classList.add('dropdown-item');
        ciudadLista.appendChild(li);
    });
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            const cityName = this.textContent;
            callAPI(cityName); 
        });

    });
    
}


function obtenerCiudadesGuardadas() {
    return JSON.parse(localStorage.getItem('Ciudades')) || [];
}

function borrarCiudadesAlmacenadas() {
    localStorage.removeItem('Ciudades');
    
    document.getElementById('lista-ciudades').innerHTML = '';

}


window.onload = mostrarCiudadesGuardadas;



function clearHTML(){
    datosClima.innerHTML = '';
    buscador.innerHTML= "";
}



async function callAPI(ciudad = "Rafaela", pais = "AR"){
    const apiID= 'd93db55aca6c923e6420caaba7b519a6';
    const url= `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiID}`;

    try {
        const respuesta = await fetch (url);
        if (!respuesta.ok) throw new Error("Error en la consulta a la API");
        const datosJSON = await respuesta.json();
        if (datosJSON.cod === "404") {
            throw new Error ("No se pudo encontrar la ciudad");
            
        }else{
            clearHTML();
            mostrarClima(datosJSON);
            actualizarFondo(datosJSON.weather[0].main);
        }
    }
    catch (error) {    
        mostrarError(error.message)
    } 

}



function kelvinCentigrado(temperatura = 0){
    return parseInt(temperatura - 273.15);
}

function convertirGradosADireccion(grados = 0) {
    const direcciones = [
        "Norte",         // 0° - 11.25°
        "Norte-Noreste", // 11.25° - 33.75°
        "Noreste",       // 33.75° - 56.25°
        "Este-Noreste",  // 56.25° - 78.75°
        "Este",          // 78.75° - 101.25°
        "Este-Sureste",  // 101.25° - 123.75°
        "Sureste",       // 123.75° - 146.25°
        "Sur-Sureste",   // 146.25° - 168.75°
        "Sur",           // 168.75° - 191.25°
        "Sur-Suroeste",  // 191.25° - 213.75°
        "Suroeste",      // 213.75° - 236.25°
        "Oeste-Suroeste",// 236.25° - 258.75°
        "Oeste",         // 258.75° - 281.25°
        "Oeste-Noroeste",// 281.25° - 303.75°
        "Noroeste",      // 303.75° - 326.25°
        "Norte-Noroeste" // 326.25° - 348.75°
    ];

    
    grados = grados % 360;
    if (grados < 0) grados += 360;

    
    const indice = Math.floor((grados + 11.25) / 22.5) % 16;
    return direcciones[indice];
}

function mskmh (speed = 0) {
    let kmh = speed * 3.6;
    return (kmh.toFixed(1));
}



function mostrarClima (data) {
   
        const {name, main: {temp, temp_min, temp_max, humidity, pressure}, sys: {sunrise, sunset},
         wind : {speed, deg}, weather:[array]} = data;
        
        const temperature = kelvinCentigrado(temp);
        const tempMax = kelvinCentigrado(temp_max);
        const tempMin = kelvinCentigrado(temp_min);
        const windDirection = convertirGradosADireccion(deg);
        const speedConverted = mskmh(speed)


        const contenido = document.createElement("div");
        contenido.classList.add("weather-card");
        contenido.innerHTML= `
        <h5>Clima en ${name}</h5>
            <img title=${array.description} class="weather-image" src="icons/${array.icon}.svg"  alt=${name}>
            <div class= "weather-main">
                <img title="Temperatura promedio" class="weather-icon" src="fixedicons/thermometer.svg" alt="thermometer-celsius" width="120px" height="120px">
                ${temperature}°C
            </div>
            <div class="weather-info">
                <p><img title="Temperatura maxima actual" class="fixedicons" src="fixedicons/thermometer-warmer.svg" alt="tempmax">
                        ${tempMax}<span id="card-span">°C</span> </p>
                <p><img title="Temperatura minima actual" class="fixedicons" src="fixedicons/thermometer-colder.svg" alt="tempmin"> 
                    ${tempMin}<span id="card-span">°C</span></p> 
                <p> <img title="Humedad" class="fixedicons" src="fixedicons/humidity.svg" alt="humedad">
                    ${humidity}<span id="card-span">%</span> </p>
                <p> <img title="Presion atmosferica" class="fixedicons" src="fixedicons/pressure-low.svg" alt="presion">
                     ${pressure}<span id="card-span">hPa</span></p>
                <p class="weather-wind">  <img title="Velocidad viento" class="fixedicons" src="fixedicons/wind.svg" alt="viento">
                     ${speedConverted} <span id="card-span">km/h</span> </p>  
                <p><img title="Direccion viento" class="fixedicons" src="fixedicons/compass.svg" alt="direccionviento">
                     ${windDirection}  </p>
            </div>    
        
    <div id="carouselExampleCaptions" class="carousel slide">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="fixedicons/sunrise.svg" class="d-block w-100" alt="sunrise">
          <div class="carousel-caption  d-md-inline">
            <h6 class="titulo-carrusel">Salida del sol: <span class="span-carrusel">${new Date(sunrise * 1000).toLocaleTimeString()} a.m.</span> </h6>
            
          </div>
        </div>
        <div class="carousel-item">
          <img src="fixedicons/sunset.svg" class="d-block w-100" alt="sunset">
          <div class="carousel-caption d-md-block">
            <h6 class="titulo-carrusel">Puesta del sol: <span class="span-carrusel">${new Date(sunset * 1000).toLocaleTimeString()} p.m </span></h6>
            
          </div>
        </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
        `;
        datosClima.appendChild(contenido);
        
}

function mostrarError(mensaje){
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: mensaje,
        
      });;
}

function actualizarFondo(clima) {
    const body = document.body;
    body.classList.remove('clear-sky', 'cloudy', 'rainy', 'thunderstorm', 'snow', 'fog', 'windy');

    switch (clima) {
        case 'Clear':
            body.classList.add('clear-sky');
            break;
        case 'Clouds':
            body.classList.add('cloudy');
            break;
        case 'Rain':
            body.classList.add('rainy');
            break;
        case 'Thunderstorm':
            body.classList.add('thunderstorm');
            break;
        case 'Snow':
            body.classList.add('snow');
            break;
        case 'Mist':
        case 'Fog':
            body.classList.add('fog');
            break;
        case 'Wind':
            body.classList.add('windy');
            break;
        default:
            body.classList.add('default');
    }
}
