$(document).ready(function () {
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



    /* PARTIDA ACTUAL */
    var partidaActual = {
        numeroVidas: 10,
        tiempo: 100,
        toFind: paises[Math.floor(Math.random() * paises.length)],
        finding: [],
        pista: true,
        letrasUsadas: []
    }

    if (localStorage.getItem("partida") != null) {
        partidaActual = JSON.parse(localStorage.getItem("partida"));
        console.log(partidaActual);
    }
    /**/

    console.log(partidaActual.toFind);
    $("#vidas").text(partidaActual.numeroVidas);
    var $finding = $("<p>", {
        "class": "finding"
    });

    /* HISTORICO */
    var historico = {
        ganadas: 0,
        perdidas: 0
    }
    if (localStorage.getItem("historico") != null) {
        historico = JSON.parse(localStorage.getItem("historico"));
        $("#historico-ganadas").text(historico.ganadas);
        $("#historico-perdidas").text(historico.perdidas);
    }
    /**/



    /* ELEMENTO A BUSCAR */
    $(".centrado").append($finding);

    for (var i = 0; i < partidaActual.toFind.length; i++) {
        if (partidaActual.finding.length > 0 + i) {

        } else {
            if (partidaActual.toFind[i] == " ") {
                partidaActual.finding[i] = " ";
            } else {
                partidaActual.finding[i] = "-";
            }
        }
    }

    $finding.text(partidaActual.finding.join(""));
    console.log(partidaActual);
    /**/

    /* TIEMPO RESTANTE */
    var timer;
    countDown();

    function countDown() {
        $tiempoRestante = $("#tiempo-restante");
        $tiempoRestante.text(partidaActual.tiempo);

        timer = setInterval(function () {
            if (partidaActual.tiempo == 0) {
                sumarPerdida();
                clearInterval(timer);
            } else {
                partidaActual.tiempo = partidaActual.tiempo - 1;
                $tiempoRestante.text(partidaActual.tiempo);
            }
            localStorage.setItem("partida", JSON.stringify(partidaActual));
        }, 1000);
    }
    /**/


    /* PRUEBA LETRAS Y BUSCA RESULTADO */
    for (var i = 0; i < $(".botones-abecedario > button").length; i++) {
        $(".botones-abecedario > button").eq(i).on('click', function () {
            letraClick(this);
        });

        for (var j = 0; j < partidaActual.letrasUsadas.length; j++) {
            if (($(".botones-abecedario > button").eq(i).text()) == partidaActual.letrasUsadas[j]) {
                $(".botones-abecedario > button").eq(i).attr("disabled", true);
            }
        }
    }


    function letraClick(evento) {
        var error = true;
        console.log(evento.innerHTML);

        for (var i = 0; i < partidaActual.toFind.length; i++) {
            if (partidaActual.toFind[i] == evento.innerHTML) {
                console.log("COINCIDE");
                partidaActual.finding[i] = evento.innerHTML;
                $finding.text(partidaActual.finding.join(""));

                if ($finding[0].innerText == partidaActual.toFind) {
                    sumarGanada();
                }
                error = false;
            }
        }

        if (error == true) {
            if (partidaActual.numeroVidas > 1) {
                --partidaActual.numeroVidas;
            } else {
                partidaActual.numeroVidas = 0;
                sumarPerdida();
            }
            $("#vidas").text(partidaActual.numeroVidas);
        }
        evento.disabled = true;

        partidaActual.letrasUsadas.push(evento.innerHTML);
        console.log(partidaActual);
    }
    /**/


    /* PISTA */
    if (!partidaActual.pista) {
        $("#pista").attr("disabled", true);
    }
    $("#pista").on("click", function () {
        pistaClick(this);
    });

    function pistaClick(evento) {
        partidaActual.pista = false;
        console.log(partidaActual);
        console.log(evento.innerHTML);
        clearInterval(timer);
        countDown(($("#tiempo-restante").text()) - 10);
        evento.disabled = true;
    }
    /**/
    
    /* REINICIAR */
    $("#reiniciar").on("click", function () {
        sumarPerdida();
        location.reload();
    });

    function sumarGanada() {
        $(".centrado").append($("<p>"), {
            text: "VICTORIA"
        });
        alert("Has ganado");
        ++historico.ganadas;
        $("#historico-ganadas").text(historico.ganadas);
        clearInterval(timer);
        localStorage.removeItem("partida");
        localStorage.setItem("historico", JSON.stringify(historico));
    }

    function sumarPerdida() {
        alert("Has perdido");
        ++historico.perdidas;
        $("historico-perdidas").text(historico.perdidas);
        clearInterval(timer);
        localStorage.removeItem("partida");
        localStorage.setItem("historico", JSON.stringify(historico));
    }

});
