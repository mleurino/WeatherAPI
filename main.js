const datosClima = document.querySelector(".weather-container");
const formulario= document.querySelector(".get-weather");
const nombreCiudad = document.querySelector("#city");
const nombrePais = document.querySelector("#country");



formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(nombreCiudad.value);
    console.log(nombrePais.value);

    if (nombreCiudad.value === "" || nombrePais.value === "") {
        showError("Asegúrese de completar ambos campos")
        return
    };



    callAPI(nombreCiudad.value, nombrePais.value);
})

function clearHTML(){
    datosClima.innerHTML = '';
}



function callAPI(ciudad, pais){
    const apiID= 'd93db55aca6c923e6420caaba7b519a6';
    const url= `http://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiID}`;

    fetch(url)
        .then(datos => {
            return datos.json()
        })
        .then(datosJSON => {
            if (datosJSON.cod === "404") {
                showError("No se pudo encontrar la ciudad");
                
            }else{
                clearHTML();
                showWeather(datosJSON);
            }
            
        })
            .catch(error => {
                console.log(error)});

}

function kelvinToCentigrade(temperatura){
    return parseInt(temperatura - 273.15);
}

function convertirGradosADireccion(grados) {
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

    // Normalizar los grados para que estén entre 0 y 360
    grados = grados % 360;
    if (grados < 0) grados += 360;

    // Calcular la dirección correspondiente
    const indice = Math.floor((grados + 11.25) / 22.5) % 16;
    return direcciones[indice];
}

function msTokmh (speed) {
    let kmh = speed * 3.6;
    return (kmh.toFixed(2));
}



function showWeather (data) {
   
        const {name, main: {temp, temp_min, temp_max, humidity, pressure}, wind : {speed, deg}, weather:[array]} = data;
        console.log(data);
        const temperature = kelvinToCentigrade(temp);
        const tempMax = kelvinToCentigrade(temp_max);
        const tempMin = kelvinToCentigrade(temp_min);
        const windDirection = convertirGradosADireccion(deg);
        const speedConverted = msTokmh(speed)


        const contenido = document.createElement("div");
        contenido.innerHTML= `
        <h5>Clima en ${name}</h5>
            <img src="https://openweathermap.org/img/wn/${array.icon}@2x.png" alt=${name}>
            <h2>${temperature}°</h2>
            <p>Max: ${tempMax}°</p>
            <p>Min: ${tempMin}°</p> 
            <p>Humedad: ${humidity}%</p>
            <p>Vientos: ${speedConverted} km/h, ${windDirection}</p>
            <p>Presion atmosferica: ${pressure}</p>
        `;
        datosClima.appendChild(contenido);
        
}



function showError(mensaje){
    console.log(mensaje);
}





