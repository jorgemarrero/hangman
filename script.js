var $nickname;
var timer;
var $finding = $("<p>", {
    "class": "finding"
});
var partidaActual = {
        actual: "none"
}

var API_KEY_OMDB = "3370463f";

//localStorage.removeItem("partida");


$(document).ready(function () {
    var aleatorio = Math.floor(Math.random() * ($(".botones-abecedario > button").length));
    console.log($(".botones-abecedario > button").eq(aleatorio).text());


    $(".logged").hide();

    function prepareToPlay() {
        partidaActual.actual = $nickname;

        $(".no-logged").hide();
        $(".logged").show();

        if (partidaActual[$nickname] == undefined) {
            partidaActual[$nickname] = {};
            partidaActual[$nickname].ganadas = 0;
            partidaActual[$nickname].perdidas = 0;
            partidaActual[$nickname].streak = [];  
        }

        partidaActual[$nickname].numeroVidas = 8;
        partidaActual[$nickname].tiempo = 50;
        partidaActual[$nickname].toFind = [];
        partidaActual[$nickname].finding = [];
        partidaActual[$nickname].pista = true;
        partidaActual[$nickname].rendirse = true;
        partidaActual[$nickname].ganado = false;
        partidaActual[$nickname].perdido = false;
        partidaActual[$nickname].letrasUsadas = [];
        
    }
    
    /*************************** COMPRUEBA SI EXISTE JUGANDO *******************************************/
    /***************************************************************************************************/
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
    
    /***************************************************************************************************/
    
    
    /********************************************* BUTTONS *********************************************/
    /***************************************************************************************************/
    /* A JUGAR */
    $("#a-jugar").on("click", function () {
        $nickname = $("#nickname").val();
        prepareToPlay();
        peliculaDB(false, false);
    });
    
    $("#a-jugar-invitado").on("click", function () {  
        $nickname = $("#nickname-invitado").val();
        prepareToPlay();
        peliculaDB(false, true);
    });
    /**/

    /* CERRAR SESIÓN */
    $("#close-sesion").on("click", function () {
        checkLose();
        partidaActual.actual = "none";
        localStorage.setItem("partida", JSON.stringify(partidaActual));
        location.reload();
    });
    
    /* RETAR */
    $("#retar").on("click", function () {
        checkLose();
        partidaActual.actual = "reto";
        localStorage.setItem("partida", JSON.stringify(partidaActual));
        location.reload();

    });
    
    /* TRY RESOLVE */
    $("#try-resolve").popover({ 
        html : true,
        title: function() {
          return $("#popover-head").html();
        },
        content: function() {
          return $("#popover-content").html();
        }
    });
    
    
    /* REINICIAR */
    $("#reiniciar").on("click", function () {
        checkLose();
        prepareToPlay();
        peliculaDB(true, false);
    });
        
    function checkLose() {
        if (!(partidaActual[$nickname].finding.join("") == partidaActual[$nickname].toFind.join(""))) {
            ++partidaActual[$nickname].perdidas;
        }
    }

    /***************************************************************************************************/
    
    
    /****************************** TAKE FILM FROM API & FILTER IT *************************************/
    /***************************************************************************************************/
    function peliculaDB(reiniciar, retar) {
        if (retar) {
            $.getJSON("https://www.omdbapi.com/?apikey=" + API_KEY_OMDB + "&t=" + prepareSearch($("#busqueda-invitado").val()), function (result) {
                console.log(result);
                filtrandoPeliculas(result.Title, reiniciar);
                $(".invita-usuario").css("visibility", "hidden");
            });

        } else {
            $.when($.getJSON("https://www.omdbapi.com/?apikey=" + API_KEY_OMDB + "&s=" + ($(".botones-abecedario > button").eq(aleatorio).text()), function (result) {
                console.log('sucess');
                console.log(result);
                console.log(result.totalResults);

                paginas = Math.floor(Math.random() * (Math.floor(result.totalResults / 10) + 1));
            }, function () {
                console.log('error');
            })).then(function () {
                console.log('get JSON ready!');

                $.getJSON("https://www.omdbapi.com/?apikey=" + API_KEY_OMDB + "&s=" + ($(".botones-abecedario > button").eq(aleatorio).text()) + "&page=" + paginas, function (result) {
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
        
        if (reiniciar) {
            localStorage.setItem("partida", JSON.stringify(partidaActual));
            location.reload();
        } else {
            juego();
        }
    }
    /***************************************************************************************************/
    
    
    /*************************************** INTERACTION ***********************************************/
    /***************************************************************************************************/
    function juego() {
        
        $("#vidas").text(partidaActual[$nickname].numeroVidas);
        $("#historico-ganadas").text(partidaActual[$nickname].ganadas);
        $("#historico-perdidas").text(partidaActual[$nickname].perdidas);
        $("#historico-total").text(partidaActual[$nickname].streak.join("-"));
        $("#tiempo-restante").text(partidaActual[$nickname].tiempo);
        $("#jugador").text($nickname);

        $(".to-find").append($finding);

        $finding.text(partidaActual[$nickname].finding.join(""));
        console.log(partidaActual);
        
        /* CHECK IF IS A RELOAD */
        if (partidaActual[$nickname].ganado) sumarGanada(true);
        else if (partidaActual[$nickname].perdido) sumarPerdida(true);
        else countDown();

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


        /* RENDIRSE */
        $("#rendirse").on("click", function () {
            partidaActual[$nickname].rendirse = false;
            partidaActual[$nickname].pista = false;
            this.disabled = true;
            sumarPerdida(false);
        });
        
        /* PISTA */
        if (!partidaActual[$nickname].pista) {
            $("#pista").attr("disabled", true);
            $(".to-find .whats-movie").append($("<span>", {
                "text": " - Your hint is: " + partidaActual[$nickname].pistaTexto
            }));
        }
        $("#pista").on("click", function () {
            $("#pista").prop("disabled", true);

            $.getJSON("https://www.omdbapi.com/?apikey=" + API_KEY_OMDB + "&t=" + prepareSearch(partidaActual[$nickname].peliculaFiltrar), function (result) {
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

                $(".to-find .whats-movie").append($("<span>", {
                    "text": " - Your hint is: " + partidaActual[$nickname].pistaTexto
                }));

            });
        });
    }

    /********************************   /////////    \\\\\\\\\\   **************************************/
    function letraClick(evento) {
        var error = true;
        console.log(evento.innerHTML);

        for (var i = 0; i < partidaActual[$nickname].toFind.length; i++) {
            if (partidaActual[$nickname].toFind[i] == evento.innerHTML) {
                console.log("COINCIDE");
                partidaActual[$nickname].finding[i] = evento.innerHTML;
                $finding.text(partidaActual[$nickname].finding.join(""));

                if (partidaActual[$nickname].finding.join("") == partidaActual[$nickname].toFind.join("")) {
                    sumarGanada(false);
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
    
    /********************************   /////////    \\\\\\\\\\   **************************************/
    function countDown() {
        $tiempoRestante = $("#tiempo-restante");
        $tiempoRestante.text(partidaActual[$nickname].tiempo);

        timer = setInterval(function () {
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
    /***************************************************************************************************/
    
    
    /*************************************** GAME-OVER ***********************************************/
    /***************************************************************************************************/
    function sumarGanada(reload) {    
        $(".to-find").append("<p class='texto-resultado'>Congratulations! You win!</p>");
        partidaActual[$nickname].ganado = true;
        
        if (!reload) {
            ++partidaActual[$nickname].ganadas;
            if (partidaActual[$nickname].streak.length >= 5) partidaActual[$nickname].streak.splice(0, 1);
            partidaActual[$nickname].streak.push("W");
        }

        $("#historico-ganadas").text(partidaActual[$nickname].ganadas);

        finPartida();
    }

    function sumarPerdida(reload) {
        $(".to-find").append("<p class='texto-resultado'>I am sorry! You lose!</p>");
        partidaActual[$nickname].perdido = true;
        
        if (!reload) {
            ++partidaActual[$nickname].perdidas;
            if (partidaActual[$nickname].streak.length >= 5) partidaActual[$nickname].streak.splice(0, 1);
            partidaActual[$nickname].streak.push("L");
        }

        $("#historico-perdidas").text(partidaActual[$nickname].perdidas);

        $finding.text(partidaActual[$nickname].peliculaFiltrar);
        partidaActual[$nickname].finding = partidaActual[$nickname].toFind;

        $("#vidas-hangman").attr("src", "img/vida0.jpg");
        
        finPartida();
    }

    function finPartida() {        
        $("#historico-total").text(partidaActual[$nickname].streak.join("-"));
        $("#reiniciar").removeAttr("disabled");
        $("#rendirse").attr("disabled", true);
        $("#pista").prop("disabled", true);
        
        clearInterval(timer);
        localStorage.setItem("partida", JSON.stringify(partidaActual));
        for (var i = 0; i < $(".botones-abecedario > button").length; i++) {
            $(".botones-abecedario > button").eq(i).attr("disabled", true);
        }
    }
    
});


function prepareSearch(toSearch) {
    var busqueda = [];
    var indice = 0;

    for (var i = 0; i < toSearch.length; i++) {
        if (toSearch[i] != " ") {
            busqueda[i + indice] = toSearch[i];
        } else {
            busqueda[i + indice] = "%";
            busqueda[i + 1 + indice] = "2";
            busqueda[i + 2 + indice] = "0";
            indice = indice + 2;
        }
    }
    
    return busqueda.join("");
}

