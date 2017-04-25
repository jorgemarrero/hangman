var paises = ["EGIPTO", "ESPAÑA", "FRANCIA", "ESTONIA", "LITUANIA", "MARRUECOS", "KENIA", "RUSIA", "CHINA", "LA INDIA", "ARGENTINA", "VENEZUELA", "CHILE", "CUBA", "QATAR", "ESTADOS UNIDOS"];

var status = {
    countries: [
        {
            name: "EGIPTO",
            clue: "Pirámides"
        },
        {
            name: "ESPAÑA",
            clue: "Toros"
        },
        {
            name: "FRANCIA",
            clue: "Champagne"
        },
        {
            name: "ESTONIA",
            clue: "Tallin"
        },
        {
            name: "LITUANIA",
            clue: "Vilna"
        },
        {
            name: "MARRUECOS",
            clue: "Té verde"
        },
        {
            name: "KENYA",
            clue: "Safari"
        },
        {
            name: "RUSIA",
            clue: "Vodka"
        },
        {
            name: "CHINA",
            clue: "Arroz tres delicias"
        },
        {
            name: "LA INDIA",
            clue: "Especias"
        },
        {
            name: "ARGENTINA",
            clue: "Asado"
        },
        {
            name: "VENEZUELA",
            clue: "Maduro"
        },
        {
            name: "CHILE",
            clue: "Santiago"
        },
        {
            name: "CUBA",
            clue: "Fidel"
        },
        {
            name: "QATAR",
            clue: "Jeque"
        },
        {
            name: "ESTADOS UNIDOS",
            clue: "Hamgurguesas"
        }
    ]
}



var paisAleatorio = paises[Math.floor(Math.random() * paises.length)];
console.log(paisAleatorio);

/* ELEMENTOS AÑADIDOS */
var paisRevelado = document.createElement("p");
var body = document.querySelector(".centrado");
body.appendChild(paisRevelado);
paisRevelado.classList.add("pais-revelar");


for (var i = 0; i < paisAleatorio.length; i++) {
    var letraPais = document.createElement("span");
    if (paisAleatorio[i] == " ") {
        letraPais.innerHTML = (" ");
    } else {
        letraPais.innerHTML = ("_");
    }
    paisRevelado.appendChild(letraPais);
}


var botonesAbecedario = document.querySelectorAll(".botones-abecedario > button");
var vidas = document.getElementById("vidas");


for (var i = 0; i < botonesAbecedario.length; i++) {
    botonesAbecedario[i].addEventListener("click", letraClick);
}

function letraClick(evento) {
    var error = true;
    console.log(evento.target.innerHTML);
    for (var j = 0; j < paisAleatorio.length; j++) {
        if (paisAleatorio[j] == evento.target.innerHTML) {
            console.log("COINCIDE");
            var descubrirLetra = document.querySelectorAll(".pais-revelar > span")[j];
            descubrirLetra.innerHTML = evento.target.innerHTML;
            error = false;

            if (paisRevelado.innerText == paisAleatorio) {
                alert("Has ganado");
                sumarGanada();
            }
            console.log(paisRevelado.innerText);
            console.log(paisAleatorio);
        }
    }

    if (error == true) {
        if (partidaActual.numeroVidas > 1) {
            --partidaActual.numeroVidas;
            vidas.innerHTML = partidaActual.numeroVidas;
        } else {
            partidaActual.numeroVidas = 0;
            vidas.innerHTML = partidaActual.numeroVidas;
            alert("Has perdido");
            sumarPerdida();
        }
    }

    evento.target.disabled = true;
}

var partidaActual = {
    numeroVidas: vidas.innerHTML
}
var historico = {
    ganadas: 0,
    perdidas: 0
}

function sumarGanada() {
    ++historico.ganadas;
    historicoGanadas.innerHTML = historico.ganadas;
    localStorage.setItem("historico", JSON.stringify(historico));
}

function sumarPerdida() {
    ++historico.perdidas;
    historicoPerdidas.innerHTML = historico.perdidas;
    localStorage.setItem("historico", JSON.stringify(historico));
}

if (localStorage.getItem("historico") != null) {
    historico = JSON.parse(localStorage.getItem("historico"));
}

var historicoGanadas = document.getElementById("historico-ganadas");
var historicoPerdidas = document.getElementById("historico-perdidas");

historicoGanadas.innerHTML = historico.ganadas;
historicoPerdidas.innerHTML = historico.perdidas;


/* TIEMPO RESTANTE */
var tiempoRestanteHTML = document.getElementById("tiempo-restante");
var tiempoLimite = 60;
tiempoRestanteHTML.innerHTML = tiempoLimite;
countDown(tiempoLimite);
var timer;
function countDown(tiempo) {
    timer = setInterval(function () {
        
        if (tiempo == 0) {
            alert("Has perdido");
            sumarPerdida();
            clearInterval(timer);
        } else {
            tiempo = tiempo - 1;
            tiempoRestanteHTML.innerHTML = tiempo;
            console.log("TIEMPO" + tiempo);
        }

    }, 1000);
}

/* PISTA */
var pistaHTML = document.getElementById("pista");
pistaHTML.addEventListener("click", pistaClick);

function pistaClick(evento) {
    console.log(evento.target.innerHTML);
    clearInterval(timer);
    tiempoRestanteHTML.innerHTML -= 10;
    countDown(tiempoRestanteHTML.innerHTML);
    
    evento.target.disabled = true;
}
