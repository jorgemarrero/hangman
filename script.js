var $nickname;
var timer;
var $finding = $("<p>", {
    "class": "finding"
});

//localStorage.removeItem("partida");


$(document).ready(function () {
    var aleatorio = Math.floor(Math.random() * ($(".botones-abecedario > button").length));
    console.log($(".botones-abecedario > button").eq(aleatorio).text());


    $(".logged").hide();
    /* PARTIDA NUEVA */
    var partidaActual = {
        actual: "none"
    }
    /**/

    /* COMPRUEBA SI EXISTE JUGANDO */
    if (localStorage.getItem("partida") != null) {
        partidaActual = JSON.parse(localStorage.getItem("partida"));
        console.log(partidaActual);

        if (partidaActual.actual != "none") {
            if (partidaActual.actual == "reto") {
                $(".pide-usuario").hide();
                $(".invita-usuario").css("visibility", "visible");
            } else {
                $(".no-logged").hide();
                $(".logged").show();
                $nickname = partidaActual.actual;
                juego();
            }

        }
    }
    /**/


    /* A JUGAR */
    $("#a-jugar").on("click", function () {
        $nickname = $("#nickname").val();
        partidaActual.actual = $nickname;

        console.log(partidaActual);

        $(".no-logged").hide();
        $(".logged").show();

        if (partidaActual[$nickname] != undefined) {
            console.log("Jugador conocido")
        } else {
            console.log("Nuevo jugador");
            partidaActual[$nickname] = {};
            partidaActual[$nickname].numeroVidas = 8;
            partidaActual[$nickname].tiempo = 100;
            partidaActual[$nickname].toFind = [];
            partidaActual[$nickname].finding = [];
            partidaActual[$nickname].pista = true;
            partidaActual[$nickname].rendirse = true;
            partidaActual[$nickname].letrasUsadas = [];
            partidaActual[$nickname].ganadas = 0;
            partidaActual[$nickname].perdidas = 0;
            console.log(partidaActual);
        }

        peliculaDB(false, false);
    });

    /* CERRAR SESIÓN */
    $("#close-sesion").on("click", function () {
        partidaActual.actual = "none";
        localStorage.setItem("partida", JSON.stringify(partidaActual));
        location.reload();
    });
    
    /* RETAR */
    $("#retar").on("click", function () {
        console.log("SIIIIIIII");
        if (!(partidaActual[$nickname].finding.join("") == partidaActual[$nickname].toFind.join(""))) {
            ++partidaActual[$nickname].perdidas;
        }

        partidaActual.actual = "reto";
        localStorage.setItem("partida", JSON.stringify(partidaActual));
        location.reload();

    });

    $("#a-jugar-invitado").on("click", function () {
        // TODO: función para preparar busqueda %20
        $(".no-logged").hide();
        $(".logged").show();
        
        $nickname = $("#nickname-invitado").val();
        partidaActual.actual = $nickname;
        partidaActual[$nickname] = {};
        partidaActual[$nickname].numeroVidas = 8;
        partidaActual[$nickname].tiempo = 100;
        partidaActual[$nickname].toFind = [];
        partidaActual[$nickname].finding = [];
        partidaActual[$nickname].pista = true;
        partidaActual[$nickname].rendirse = true;
        partidaActual[$nickname].letrasUsadas = [];
        peliculaDB(false, true);
        localStorage.setItem("partida", JSON.stringify(partidaActual));
    });

    /* REINICIAR */
    $("#reiniciar").on("click", function () {
        if (!(partidaActual[$nickname].finding.join("") == partidaActual[$nickname].toFind.join(""))) {
            ++partidaActual[$nickname].perdidas;
        }
        partidaActual[$nickname].numeroVidas = 8;
        partidaActual[$nickname].tiempo = 100;
        partidaActual[$nickname].toFind = [];
        partidaActual[$nickname].finding = [];
        partidaActual[$nickname].pista = true;
        partidaActual[$nickname].rendirse = true;
        partidaActual[$nickname].letrasUsadas = [];
        peliculaDB(true, false);
        localStorage.setItem("partida", JSON.stringify(partidaActual));
    });

    function peliculaDB(reiniciar, retar) {
        if (retar) {
            var busqueda = [];
            var indice = 0;
            console.log($("#busqueda-invitado").val());
            for (var i = 0; i < ($("#busqueda-invitado").val()).length; i++) {

                if (($("#busqueda-invitado").val()[i]) != " ") {
                    busqueda[i + indice] = ($("#busqueda-invitado").val()[i]);
                } else {
                    busqueda[i + indice] = "%";
                    busqueda[i + 1 + indice] = "2";
                    busqueda[i + 2 + indice] = "0";
                    indice = indice + 2;
                }
            }
            console.log(busqueda.join(""));
            $.getJSON("http://www.omdbapi.com/?t=" + busqueda.join(""), function (result) {
                console.log(result);
                filtrandoPeliculas(result.Title, reiniciar);
                $(".invita-usuario").css("visibility", "hidden");
            });

        } else {
            $.when($.getJSON("http://www.omdbapi.com/?s=" + ($(".botones-abecedario > button").eq(aleatorio).text()), function (result) {
                console.log('sucess');
                console.log(result);
                console.log(result.totalResults);

                paginas = Math.floor(Math.random() * (Math.floor(result.totalResults / 10) + 1));
            }, function () {
                console.log('error');
            })).then(function () {
                console.log('get JSON ready!');

                $.getJSON("http://www.omdbapi.com/?s=" + ($(".botones-abecedario > button").eq(aleatorio).text()) + "&page=" + paginas, function (result) {
                    console.log(result);
                    console.log(Math.floor(Math.random() * (result.Search.length)));
                    var peliculaFiltrar = result.Search[Math.floor(Math.random() * (result.Search.length))].Title;
                    console.log(peliculaFiltrar);

                    filtrandoPeliculas(peliculaFiltrar, reiniciar);

                });
            });
        }
    }

    function filtrandoPeliculas(peliculaFiltrar, reiniciar) {

        peliculaFiltrar = peliculaFiltrar.toUpperCase();
        partidaActual[$nickname].peliculaFiltrar = peliculaFiltrar;
        console.log(peliculaFiltrar);

        for (var i = 0; i < peliculaFiltrar.length; i++) {
            partidaActual[$nickname].toFind[i] = peliculaFiltrar[i];

            for (var j = 0; j < $(".botones-abecedario > button").length; j++) {

                if ((partidaActual[$nickname].toFind[i]) == ($(".botones-abecedario > button").eq(j).text())) {
                    partidaActual[$nickname].finding[i] = "_";
                    break;

                } else {
                    partidaActual[$nickname].finding[i] = partidaActual[$nickname].toFind[i];
                }
            }
        }
        console.log(partidaActual[$nickname].toFind);
        console.log(partidaActual[$nickname].finding);

        if (reiniciar) {
            localStorage.setItem("partida", JSON.stringify(partidaActual));
            location.reload();
        } else {
            juego();
        }
    }

    function filtrandoPeliculasDos(peliculaFiltrar, reiniciar) {

        peliculaFiltrar = peliculaFiltrar.toUpperCase();
        partidaActual[$nickname].peliculaFiltrar = peliculaFiltrar;
        console.log(peliculaFiltrar);

        var peliculaFiltrada = [];
        // TODO: NO BORRAR ESPECIALES, MOSTRARLOS DIRECTAMENTE
        for (var i = 0; i < peliculaFiltrar.length; i++) {

            for (var j = 0; j < $(".botones-abecedario > button").length; j++) {

                if ((peliculaFiltrar[i]) == ($(".botones-abecedario > button").eq(j).text())) {
                    peliculaFiltrada[i] = peliculaFiltrar[i];

                } else if ((peliculaFiltrar[i]) == " ") {
                    peliculaFiltrada[i] = peliculaFiltrar[i];
                }
            }

        }

        var peliculaReFiltrada = [];

        var indice = 0;
        console.log(peliculaFiltrada);
        partidaActual[$nickname].peliculaFiltrar = peliculaFiltrar;

        for (var i = 0; i < peliculaFiltrada.length; i++) {
            if (peliculaFiltrada[i] != undefined) {
                peliculaReFiltrada[i - indice] = peliculaFiltrada[i];
            } else {
                ++indice;
            }
        }

        partidaActual[$nickname].toFind = peliculaReFiltrada;
        console.log(partidaActual[$nickname].toFind);

        for (var i = 0; i < partidaActual[$nickname].toFind.length; i++) {
            if (partidaActual[$nickname].toFind[i] == " ") {
                partidaActual[$nickname].finding[i] = " ";
            } else {
                partidaActual[$nickname].finding[i] = "-";
            }
        }
        console.log(partidaActual[$nickname].finding);

        if (reiniciar) {
            localStorage.setItem("partida", JSON.stringify(partidaActual));
            location.reload();
        } else {
            juego();
        }
    }




    function juego() {
        countDown();
        $("#vidas").text(partidaActual[$nickname].numeroVidas);
        $("#historico-ganadas").text(partidaActual[$nickname].ganadas);
        $("#historico-perdidas").text(partidaActual[$nickname].perdidas);
        $("#jugador").text($nickname);

        /* ELEMENTO A BUSCAR */
        $(".to-find").append($finding);

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
        

        /* RENDIRSE */
        if (!partidaActual[$nickname].rendirse) {
            $("#rendirse").attr("disabled", true);
            sumarPerdida(true);
        }
        $("#rendirse").on("click", function () {
            partidaActual[$nickname].rendirse = false;
            partidaActual[$nickname].pista = false;
            this.disabled = true;
            $("#pista").prop("disabled", true);
            sumarPerdida(false);
        });
        
        /* PISTA */
        if (!partidaActual[$nickname].pista) {
            $("#pista").attr("disabled", true);
            mostrarPista();
        }
        $("#pista").on("click", function () {
            mostrarPista();
        });
        /**/

        function mostrarPista() {
            console.log(partidaActual[$nickname].peliculaFiltrar);
            $("#pista").prop("disabled", true);
            var busqueda = [];
            var indice = 0;
            for (var i = 0; i < partidaActual[$nickname].peliculaFiltrar.length; i++) {
                if (partidaActual[$nickname].peliculaFiltrar[i] != " ") {
                    busqueda[i + indice] = partidaActual[$nickname].peliculaFiltrar[i];
                } else {
                    busqueda[i + indice] = "%";
                    busqueda[i + 1 + indice] = "2";
                    busqueda[i + 2 + indice] = "0";
                    indice = indice + 2;
                }
            }
            console.log(busqueda.join(""));
            $.getJSON("http://www.omdbapi.com/?t=" + busqueda.join(""), function (result) {
                console.log(result);
                partidaActual[$nickname].pista = false;
                if (result.Plot != "N/A") {
                    partidaActual[$nickname].pistaTexto = result.Plot;
                } else if (result.Actors != "N/A") {
                    partidaActual[$nickname].pistaTexto = result.Actors;
                } else {
                    partidaActual[$nickname].pistaTexto = result.Released;
                }

                partidaActual[$nickname].tiempo -= 10;
                console.log(partidaActual);

                $(".to-find").append($("<p>", {
                    "text": "Tu pista es: " + partidaActual[$nickname].pistaTexto
                }));

            });

        }
    }


    function letraClick(evento) {
        var error = true;
        console.log(evento.innerHTML);

        for (var i = 0; i < partidaActual[$nickname].toFind.length; i++) {
            if (partidaActual[$nickname].toFind[i] == evento.innerHTML) {
                console.log("COINCIDE");
                partidaActual[$nickname].finding[i] = evento.innerHTML;
                $finding.text(partidaActual[$nickname].finding.join(""));

                if (partidaActual[$nickname].finding.join("") == partidaActual[$nickname].toFind.join("")) {
                    sumarGanada();
                }
                error = false;
            }
        }

        if (error == true) {
            if (partidaActual[$nickname].numeroVidas > 1) {
                --partidaActual[$nickname].numeroVidas;
                $("#vidas-hangman").attr("src", "img/vida" + partidaActual[$nickname].numeroVidas + ".jpg");
            } else {
                partidaActual[$nickname].numeroVidas = 0;
                $("#vidas-hangman").attr("src", "img/vida" + partidaActual[$nickname].numeroVidas + ".jpg");
                sumarPerdida(false);
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
        console.log(partidaActual);

        timer = setInterval(function () {
            //console.log(partidaActual);
            if (partidaActual[$nickname].tiempo == 0) {
                sumarPerdida(false);
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
        $(".to-find").append("<p class='texto-resultado'>¡Felicidades! ¡Has ganado!</p>");
        ++partidaActual[$nickname].ganadas;
        $("#historico-ganadas").text(partidaActual[$nickname].ganadas);
        clearInterval(timer);
        localStorage.setItem("partida", JSON.stringify(partidaActual));
        finPartida();
    }

    function sumarPerdida(reload) {
        $(".to-find").append("<p class='texto-resultado'>¡Lo siento! ¡Has perdido!</p>");
        if (!reload) ++partidaActual[$nickname].perdidas;
        $("#historico-perdidas").text(partidaActual[$nickname].perdidas);
        clearInterval(timer);

        $finding.text(partidaActual[$nickname].peliculaFiltrar);
        partidaActual[$nickname].finding = partidaActual[$nickname].toFind;

        $("#vidas-hangman").attr("src", "img/vida0.jpg");
        localStorage.setItem("partida", JSON.stringify(partidaActual));
        finPartida();
    }

    function finPartida() {
        for (var i = 0; i < $(".botones-abecedario > button").length; i++) {
            $(".botones-abecedario > button").eq(i).attr("disabled", true);
        }
    }

});
