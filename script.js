var $nickname;
var timer;
var $finding = $("<p>", {
    "class": "finding"
});

$(document).ready(function () {
    var paises = ["EGIPTO", "ESPAÑA", "FRANCIA", "ESTONIA", "LITUANIA", "MARRUECOS", "KENIA", "RUSIA", "CHINA", "LA INDIA", "ARGENTINA", "VENEZUELA", "CHILE", "CUBA", "QATAR", "ESTADOS UNIDOS"];

    /* PARTIDA NUEVA */
    var partidaActual = {
        //        numeroVidas: 10,
        //        tiempo: 100,
        //        toFind: paises[Math.floor(Math.random() * paises.length)],
        //        finding: [],
        //        pista: true,
        //        letrasUsadas: [],
        //        ganadas: 0,
        //        perdidas: 0,
        actual: "none",
        "Jorge M": {
            ganadas: 15,
            perdidas: 20,
            toFind: "MADRID"
        }
    }

    /**/

    /* A JUGAR */
    $("#a-jugar").on("click", function () {
        $nickname = $("#nickname").val();
        partidaActual.actual = $nickname;

        console.log(partidaActual);

        $(".pide-usuario").remove();

        if (partidaActual[$nickname] != undefined) {
            console.log("Jugador conocido")
        } else {
            console.log("Nuevo jugador");
            partidaActual[$nickname] = {};
            partidaActual[$nickname].numeroVidas = 10;
            partidaActual[$nickname].tiempo = 100;
            partidaActual[$nickname].toFind = paises[Math.floor(Math.random() * paises.length)];
            partidaActual[$nickname].finding = [];
            partidaActual[$nickname].pista = true;
            partidaActual[$nickname].letrasUsadas = [];
            partidaActual[$nickname].ganadas = 0;
            partidaActual[$nickname].perdidas = 0;
            console.log(partidaActual);
        }

        juego();
    });

    /* CERRAR SESIÓN */
    $("#close-sesion").on("click", function () {
        partidaActual.actual = "none";
        localStorage.setItem("partida", JSON.stringify(partidaActual));
        location.reload();
    });

    /* REINICIAR */
    $("#reiniciar").on("click", function () {
        if (!($finding[0].innerText == partidaActual[$nickname].toFind)) {
            ++partidaActual[$nickname].perdidas;
        }
        partidaActual[$nickname].numeroVidas = 10;
        partidaActual[$nickname].tiempo = 100;
        partidaActual[$nickname].toFind = paises[Math.floor(Math.random() * paises.length)];
        partidaActual[$nickname].finding = [];
        partidaActual[$nickname].pista = true;
        partidaActual[$nickname].letrasUsadas = [];
        localStorage.setItem("partida", JSON.stringify(partidaActual));
        location.reload();
    });

    /* COMPRUEBA SI EXISTE JUGANDO */
    if (localStorage.getItem("partida") != null) {
        partidaActual = JSON.parse(localStorage.getItem("partida"));
        console.log(partidaActual);

        if (partidaActual.actual != "none") {
            $(".pide-usuario").remove();
            $nickname = partidaActual.actual;
            juego();
        }
    }
    /**/

    function juego() {
        countDown();
        $("#vidas").text(partidaActual[$nickname].numeroVidas);
        $("#historico-ganadas").text(partidaActual[$nickname].ganadas);
        $("#historico-perdidas").text(partidaActual[$nickname].perdidas);
        $("#jugador").text($nickname);

        /* ELEMENTO A BUSCAR */
        $(".centrado").append($finding);

        for (var i = 0; i < partidaActual[$nickname].toFind.length; i++) {
            if (partidaActual[$nickname].finding.length > 0 + i) {

            } else {
                if (partidaActual[$nickname].toFind[i] == " ") {
                    partidaActual[$nickname].finding[i] = " ";
                } else {
                    partidaActual[$nickname].finding[i] = "-";
                }
            }
        }

        $finding.text(partidaActual[$nickname].finding.join(""));
        console.log(partidaActual);
        /**/

        /* PRUEBA LETRAS Y BUSCA RESULTADO */
        for (var i = 0; i < $(".botones-abecedario > button").length; i++) {
            $(".botones-abecedario > button").eq(i).on('click', function () {
                letraClick(this);
            });

            for (var j = 0; j < partidaActual[$nickname].letrasUsadas.length; j++) {
                if (($(".botones-abecedario > button").eq(i).text()) == partidaActual[$nickname].letrasUsadas[j]) {
                    $(".botones-abecedario > button").eq(i).attr("disabled", true);
                }
            }
        }
        /**/

        /* PISTA */
        if (!partidaActual[$nickname].pista) {
            $("#pista").attr("disabled", true);
        }
        $("#pista").on("click", function () {
            partidaActual[$nickname].pista = false;
            partidaActual[$nickname].tiempo -= 10;
            this.disabled = true;
        });
        /**/
    }



    function letraClick(evento) {
        var error = true;
        console.log(evento.innerHTML);

        for (var i = 0; i < partidaActual[$nickname].toFind.length; i++) {
            if (partidaActual[$nickname].toFind[i] == evento.innerHTML) {
                console.log("COINCIDE");
                partidaActual[$nickname].finding[i] = evento.innerHTML;
                $finding.text(partidaActual[$nickname].finding.join(""));

                if ($finding[0].innerText == partidaActual[$nickname].toFind) {
                    sumarGanada();
                }
                error = false;
            }
        }

        if (error == true) {
            if (partidaActual[$nickname].numeroVidas > 1) {
                --partidaActual[$nickname].numeroVidas;
            } else {
                partidaActual[$nickname].numeroVidas = 0;
                sumarPerdida();
            }
            $("#vidas").text(partidaActual[$nickname].numeroVidas);
        }
        evento.disabled = true;

        partidaActual[$nickname].letrasUsadas.push(evento.innerHTML);
        console.log(partidaActual);
    }
    /**/

    /* TIEMPO RESTANTE */
    function countDown() {
        $tiempoRestante = $("#tiempo-restante");
        $tiempoRestante.text(partidaActual[$nickname].tiempo);

        timer = setInterval(function () {
            if (partidaActual[$nickname].tiempo == 0) {
                sumarPerdida();
                clearInterval(timer);
            } else {
                partidaActual[$nickname].tiempo = partidaActual[$nickname].tiempo - 1;
                $tiempoRestante.text(partidaActual[$nickname].tiempo);
            }
            localStorage.setItem("partida", JSON.stringify(partidaActual));
        }, 1000);
    }
    /**/

    function sumarGanada() {
        $(".centrado").append($("<p>"), {
            text: "VICTORIA"
        });
        alert("Has ganado");
        ++partidaActual[$nickname].ganadas;
        $("#historico-ganadas").text(partidaActual[$nickname].ganadas);
        clearInterval(timer);
        localStorage.setItem("partida", JSON.stringify(partidaActual));
        finPartida();
    }

    function sumarPerdida() {
        alert("Has perdido");
        ++partidaActual[$nickname].perdidas;
        $("historico-perdidas").text(partidaActual[$nickname].perdidas);
        clearInterval(timer);
        localStorage.setItem("partida", JSON.stringify(partidaActual));
        finPartida();
    }

    function finPartida() {
        for (var i = 0; i < $(".botones-abecedario > button").length; i++) {
            $(".botones-abecedario > button").eq(i).attr("disabled", true);
        }
    }

});
