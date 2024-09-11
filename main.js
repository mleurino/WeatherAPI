const datosClima = document.querySelector(".weather-container");
const formulario= document.querySelector(".get-weather");
const nombreCiudad = document.querySelector("#city");
const nombrePais = document.querySelector("#country");
const buscador = document.querySelector(".buscador");
const borrarHistorial = document.querySelector(".borrar-historial")


function primeraLetraMayuscula(palabra) {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
}

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


function guardarCiudades(datosCiudad) {
    let ciudades = JSON.parse(localStorage.getItem('Ciudades')) || [];

    if (ciudades.length === 3) {
        ciudades.shift(); 
    }

    
    if (!ciudades.includes(datosCiudad)) {
        ciudades.push(datosCiudad);

    } 

    localStorage.setItem('Ciudades', JSON.stringify(ciudades));
    
}

// Función para mostrar las ciudades guardadas en la lista
function mostrarCiudadesGuardadas() {
    const cities = obtenerCiudadesGuardadas();
    const cityList = document.getElementById('lista-ciudades');
    cityList.innerHTML = ''; // Limpiar la lista antes de actualizar
    

    cities.forEach(function(city) {
        const li = document.createElement('li');
        li.textContent = city;
        li.classList.add('dropdown-item');
        cityList.appendChild(li);
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



async function callAPI(ciudad, pais){
    const apiID= 'd93db55aca6c923e6420caaba7b519a6';
    const url= `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiID}`;

    try {
        const respuesta = await fetch (url);
        const datosJSON = await respuesta.json();
        if (datosJSON.cod === "404") {
            throw new Error ("No se pudo encontrar la ciudad");
            
        }else{
            clearHTML();
            showWeather(datosJSON);
            actualizarFondo(datosJSON.weather[0].main);
            console.log(datosJSON.weather[0].main)
            console.log(datosJSON)
        }
    }
    catch (error) {    
        showError(error.message)
    } 

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

    
    grados = grados % 360;
    if (grados < 0) grados += 360;

    
    const indice = Math.floor((grados + 11.25) / 22.5) % 16;
    return direcciones[indice];
}

function msTokmh (speed) {
    let kmh = speed * 3.6;
    return (kmh.toFixed(1));
}



function showWeather (data) {
   
        const {name, main: {temp, temp_min, temp_max, humidity, pressure}, sys: {sunrise, sunset},
         wind : {speed, deg}, weather:[array]} = data;
        
        const temperature = kelvinToCentigrade(temp);
        const tempMax = kelvinToCentigrade(temp_max);
        const tempMin = kelvinToCentigrade(temp_min);
        const windDirection = convertirGradosADireccion(deg);
        const speedConverted = msTokmh(speed)


        const contenido = document.createElement("div");
        contenido.classList.add("weather-card");
        contenido.innerHTML= `
        <h5>Clima en ${name}</h5>
            <img class:"weather-ico" src="https://openweathermap.org/img/wn/${array.icon}@2x.png" alt=${name}>
            <div class: "weather-main">
                <svg class="weather-icon" width="120px" height="120px" viewBox="-8.4 -8.4 40.80 40.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192"></g><g id="SVGRepo_iconCarrier"> <path d="M12 15.9998C11.4477 15.9998 11 16.4475 11 16.9998C11 17.5521 11.4477 17.9998 12 17.9998C12.5523 17.9998 13 17.5521 13 16.9998C13 16.4475 12.5523 15.9998 12 15.9998ZM12 15.9998L12.0071 10.5M12 16.9998L12.0071 17.0069M16 16.9998C16 19.209 14.2091 20.9998 12 20.9998C9.79086 20.9998 8 19.209 8 16.9998C8 15.9854 8.37764 15.0591 9 14.354L9 6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V14.354C15.6224 15.0591 16 15.9854 16 16.9998Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
                </svg>
                ${temperature}°C
            </div>
           <p><svg width="80px" height="80px" viewBox="-8.4 -8.4 40.80 40.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 3V21M18 3L15 6M18 3L21 6M7 15.9998C6.44772 15.9998 6 16.4475 6 16.9998C6 17.5521 6.44772 17.9998 7 17.9998C7.55228 17.9998 8 17.5521 8 16.9998C8 16.4475 7.55228 15.9998 7 15.9998ZM7 15.9998V11.9998M7 16.9998L7.00707 17.0069M11 16.9998C11 19.209 9.20914 20.9998 7 20.9998C4.79086 20.9998 3 19.209 3 16.9998C3 15.9854 3.37764 15.0591 4 14.354L4 6C4 4.34315 5.34315 3 7 3C8.65685 3 10 4.34315 10 6V14.354C10.6224 15.0591 11 15.9854 11 16.9998Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
                </svg>
                ${tempMax}°C </p>
            <p><svg width="80px" height="80px" viewBox="-8.4 -8.4 40.80 40.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 3V21M18 21L15 18M18 21L21 18M7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44772 18 7 18C7.55228 18 8 17.5523 8 17C8 16.4477 7.55228 16 7 16ZM7 16V12M7 17L7.00707 17.0071M11 17C11 19.2091 9.20914 21 7 21C4.79086 21 3 19.2091 3 17C3 15.9856 3.37764 15.0593 4 14.3542L4 6.00017C4 4.34332 5.34315 3.00017 7 3.00017C8.65685 3.00017 10 4.34332 10 6.00017V14.3542C10.6224 15.0593 11 15.9856 11 17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
                </svg> ${tempMin}°C</p> 
            <p> <svg width="80px" height="80px" viewBox="-8.4 -8.4 40.80 40.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0066 3.25608C16.8483 2.85737 19.1331 2.8773 22.2423 3.65268C22.7781 3.78629 23.1038 4.32791 22.9699 4.86241C22.836 5.39691 22.2931 5.7219 21.7573 5.58829C18.8666 4.86742 16.9015 4.88747 15.4308 5.20587C13.9555 5.52524 12.895 6.15867 11.7715 6.84363L11.6874 6.89494C10.6044 7.55565 9.40515 8.28729 7.82073 8.55069C6.17734 8.82388 4.23602 8.58235 1.62883 7.54187C1.11607 7.33724 0.866674 6.75667 1.0718 6.24513C1.27692 5.73359 1.85889 5.48479 2.37165 5.68943C4.76435 6.6443 6.32295 6.77699 7.492 6.58265C8.67888 6.38535 9.58373 5.83916 10.7286 5.14119C11.855 4.45445 13.1694 3.6538 15.0066 3.25608Z" fill="#0F0F0F"></path> <path d="M22.2423 7.64302C19.1331 6.86765 16.8483 6.84772 15.0066 7.24642C13.1694 7.64415 11.855 8.44479 10.7286 9.13153C9.58373 9.8295 8.67888 10.3757 7.492 10.573C6.32295 10.7673 4.76435 10.6346 2.37165 9.67977C1.85889 9.47514 1.27692 9.72393 1.0718 10.2355C0.866674 10.747 1.11607 11.3276 1.62883 11.5322C4.23602 12.5727 6.17734 12.8142 7.82073 12.541C9.40515 12.2776 10.6044 11.546 11.6874 10.8853L11.7715 10.834C12.895 10.149 13.9555 9.51558 15.4308 9.19621C16.9015 8.87781 18.8666 8.85777 21.7573 9.57863C22.2931 9.71224 22.836 9.38726 22.9699 8.85275C23.1038 8.31825 22.7781 7.77663 22.2423 7.64302Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9998 10.0266C18.6526 10.0266 18.3633 10.2059 18.1614 10.4772C18.0905 10.573 17.9266 10.7972 17.7089 11.111C17.4193 11.5283 17.0317 12.1082 16.6424 12.7555C16.255 13.3996 15.8553 14.128 15.5495 14.8397C15.2567 15.5213 14.9989 16.2614 14.9999 17.0117C15.0006 17.2223 15.0258 17.4339 15.0604 17.6412C15.1182 17.9872 15.2356 18.4636 15.4804 18.9521C15.7272 19.4446 16.1131 19.9674 16.7107 20.3648C17.3146 20.7664 18.0748 21 18.9998 21C19.9248 21 20.685 20.7664 21.2888 20.3648C21.8864 19.9674 22.2724 19.4446 22.5192 18.9522C22.764 18.4636 22.8815 17.9872 22.9393 17.6413C22.974 17.4337 22.9995 17.2215 22.9998 17.0107C23.0001 16.2604 22.743 15.5214 22.4501 14.8397C22.1444 14.128 21.7447 13.3996 21.3573 12.7555C20.968 12.1082 20.5803 11.5283 20.2907 11.111C20.073 10.7972 19.909 10.573 19.8382 10.4772C19.6363 10.2059 19.3469 10.0266 18.9998 10.0266ZM20.6119 15.6257C20.3552 15.0281 20.0049 14.3848 19.6423 13.782C19.4218 13.4154 19.2007 13.0702 18.9998 12.7674C18.7989 13.0702 18.5778 13.4154 18.3573 13.782C17.9948 14.3848 17.6445 15.0281 17.3878 15.6257L17.3732 15.6595C17.1965 16.0704 16.9877 16.5562 17.0001 17.0101C17.0121 17.3691 17.1088 17.7397 17.2693 18.0599C17.3974 18.3157 17.574 18.5411 17.8201 18.7048C18.06 18.8643 18.4248 19.0048 18.9998 19.0048C19.5748 19.0048 19.9396 18.8643 20.1795 18.7048C20.4256 18.5411 20.6022 18.3156 20.7304 18.0599C20.8909 17.7397 20.9876 17.3691 20.9996 17.01C21.0121 16.5563 20.8032 16.0705 20.6265 15.6597L20.6119 15.6257Z" fill="#0F0F0F"></path> <path d="M14.1296 11.5308C14.8899 11.2847 15.4728 12.076 15.1153 12.7892C14.952 13.1151 14.7683 13.3924 14.4031 13.5214C13.426 13.8666 12.6166 14.3527 11.7715 14.8679L11.6874 14.9192C10.6044 15.5799 9.40516 16.3115 7.82074 16.5749C6.17735 16.8481 4.23604 16.6066 1.62884 15.5661C1.11608 15.3615 0.866688 14.7809 1.07181 14.2694C1.27694 13.7578 1.8589 13.509 2.37167 13.7137C4.76436 14.6685 6.32297 14.8012 7.49201 14.6069C8.67889 14.4096 9.58374 13.8634 10.7286 13.1654C11.8166 12.5021 12.9363 11.9171 14.1296 11.5308Z" fill="#0F0F0F"></path> </g>
                </svg> ${humidity}%</p>
            <p class:"weather-wind"> <span>  <svg width="80px" height="80px" viewBox="-8.4 -8.4 40.80 40.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z" fill="#000000"></path> </g>
                </svg> ${speedConverted} km/h, ${windDirection} </span>  </p>
            <p> <svg width="80px" height="80px" viewBox="-8.4 -8.4 40.80 40.80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(90)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z" fill="#000000"></path> </g>
                </svg> ${pressure}hPa</p>
            <p> </p>
            <p> Sunrise: ${new Date(sunrise * 1000).toLocaleTimeString()} a.m  </p>
            <p> Sunset: ${new Date(sunset * 1000).toLocaleTimeString()} p.m </p>
        `;
        datosClima.appendChild(contenido);
        
}

function showError(mensaje){
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
