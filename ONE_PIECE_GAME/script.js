//Recursos iniciales
var berry = 0
var piedras = 0
var madera = 0
var trabajadores = 0
var trigo = 0
var cuero = 0
var caballos = 0
var pan = 0

//Boleanos que exponen la situacion de juego
var edificiosExiste = false
var almacenExiste = false
var granjaExiste = false
var mercadoExiste = false
var establoExiste = false
var molinoExiste = false
var tabernaExiste = false
var muelleExiste = false

//Coste inicial de choza (va cambiando)
let costeChoza = 6

//Cantidades para mercado
var cantidadPiedras = 1
var cantidadMadera = 1
var cantidadCuero = 1
var cantidadPan = 1

//Controla los intervalos de trigo y berry
var intervaloTrigo
var intervaloBerry
var intervaloContadorTrigo

//Zoom del mapa
var zoom = 100

//Posicion del mapa
var posicionMapaTop = 0
var posicionMapaLeft = 2372

window.onload = () => {

    maquetarEleccionDePartida()
    maquetarMensajes()
    maquetarVentanas()
    maquetarVentanaMercado()
    maquetarBotonesSecciones()
    maquetarConstruccionesOverflow()
    maquetarAldea()
    maquetarRecursos()
    activarBotonesCantidadesMercado()

    //Controla el poder pausar o reanudar la música
    document.getElementsByClassName("controlesAudio")[0].onclick = () => { controladorAudio() }
    document.getElementsByTagName("audio")[0].volume = 0.2
    //En caso de darle a nueva partida:
    document.querySelector("#nueva").onclick = () => {
        actualizarRecursos()
        document.getElementsByClassName("audio")[0].removeChild(document.getElementsByTagName("audio")[0])
        document.getElementsByTagName("audio")[0].volume = 0.3
        if (document.getElementsByClassName("controlesAudio")[0].id == "on") {
            document.getElementById("imgAudio").setAttribute("src", "./media/audioOn.png")
            document.getElementsByTagName("audio")[0].play()
            document.getElementsByClassName("controlesAudio")[0].id = "on"
        } else {
            document.getElementById("imgAudio").setAttribute("src", "./media/audioOff.png")
            document.getElementsByTagName("audio")[0].pause()
            document.getElementsByClassName("controlesAudio")[0].id = "off"
        }
        document.getElementsByClassName("controlesAudio")[0].onclick = () => { controladorAudio() }
        activarContador("nueva") //INICIA EL CONTADOR DEL TIEMPO
        cargarInterfaz() //ASIGNA ANIMACIONES Y FUNCIONALIDAD A LA INTERFAZ
        bloquarPulsadores() //BLOQUEA LOS BOTONES
        mensajesDeInformacion() //ASIGNA EL MENSAJE DE CADA BOTON DE INFO
        ocultarNew() //OCULTA LOS "NEW" DE LOS EDIFICIOS
        document.getElementById("notificacionCircularTaberna").style.visibility = "hidden"
        document.getElementById("notificacionCircularGranja").style.visibility = "hidden"

        //GUARDA DATOS EN LOCALSTORAGE
        localStorage.setItem("displayConstrucciones", "hidden")
        localStorage.setItem("displayNavegar", "hidden")

        funcionalidadMensajes() //ASIGNAR FUNCIONALIDAD DE CIERRE A LOS MENSAJES EMERGENTES

        //ASIGNAR FUNCINALIDAD AL BOTON DE MONEDAS Y MENSAJE DE INICIO
        mensaje("¡Bienvenido aventurero!\n\nAcabas de iniciar tu camino hacia\nconvertirte en un gran pirata . . .\nPero para ello debes empezar desde\nlo mas bajo grumete. Debes ganar\nmaterial y dinero para construir\ntu barco y hacerte a la mar...\nEmpecemos ganando un par de Berrys.\n\nPor cierto, me llamo Chopper y voy a \nayudarte para que consigas tu objetivo . . .\n\n¡Y no soy un mapache, soy un reno!")
        document.getElementById("botonBerry").onclick = () => { generarBerry() }
    }

    //En caso de darle a cargar partida:
    document.querySelector("#cargar").onclick = () => {
        //IGUALAR TODAS LAS VARIBALES GUARDADAS EN LOCALSTORAGE
        berry = parseInt(localStorage.getItem("Berry"))
        piedras = parseInt(localStorage.getItem("Piedras"))
        madera = parseInt(localStorage.getItem("Madera"))
        trabajadores = parseInt(localStorage.getItem("Trabajadores"))
        trigo = parseInt(localStorage.getItem("Trigo"))
        cuero = parseInt(localStorage.getItem("Cuero"))
        caballos = parseInt(localStorage.getItem("Caballos"))
        pan = parseInt(localStorage.getItem("Pan"))
        costeChoza = parseInt(localStorage.getItem("costeChoza"))
        //IGUALAR TODOS LOS BOLEANOS GUARDADOS EN LOCALSTORAGE
        if (localStorage.getItem("edificiosExiste") == 'true') edificiosExiste = true; else edificiosExiste = false
        if (localStorage.getItem("almacenExiste") == 'true') almacenExiste = true; else almacenExiste = false
        if (localStorage.getItem("granjaExiste") == 'true') granjaExiste = true; else granjaExiste = false
        if (localStorage.getItem("mercadoExiste") == 'true') mercadoExiste = true; else mercadoExiste = false
        if (localStorage.getItem("establoExiste") == 'true') establoExiste = true; else establoExiste = false
        if (localStorage.getItem("molinoExiste") == 'true') molinoExiste = true; else molinoExiste = false
        if (localStorage.getItem("tabernaExiste") == 'true') tabernaExiste = true; else tabernaExiste = false
        if (localStorage.getItem("muelleExiste") == 'true') muelleExiste = true; else muelleExiste = false

        //ELIMINA LA MUSICA DE INTRO Y REPRODUCE LA MUSICA PRINCIPAL DEL JUEGO
        document.getElementsByClassName("audio")[0].removeChild(document.getElementsByTagName("audio")[0])
        document.getElementsByTagName("audio")[0].play()
        document.getElementsByTagName("audio")[0].volume = 0.3
        //ASIGNAR CONTROLADOR AL BOTON DE AUDIO
        document.getElementsByClassName("controlesAudio")[0].onclick = () => { controladorAudio() }

        activarContador("cargar") //REANUDA CONTADOR DE TIEMPO
        cargarInterfaz() //ASIGNA ANIMACIONES Y FUNCIONALIDAD A LA INTERFAZ
        bloquarPulsadores() //BLOQUEA LOS BOTONES
        mensajesDeInformacion() //ASIGNA EL MENSAJE DE CADA BOTON DE INFO
        ocultarNew() //OCULTA LOS "NEW" DE LOS EDIFICIOS

        funcionalidadMensajes() //ASIGNAR FUNCIONALIDAD DE CIERRE A LOS MENSAJES EMERGENTES

        //ASIGNAR FUNCINALIDAD AL BOTON DE MONEDAS
        document.getElementById("botonBerry").onclick = () => { generarBerry() }

        //REVISA EL PROGRESO PARA CARGAR LA PARTIDA POR DONDE LA DEJASTE
        document.getElementById("botonConstrucciones").style.visibility = localStorage.getItem("displayConstrucciones")
        document.getElementById("botonNavegar").style.visibility = localStorage.getItem("displayNavegar")
        document.getElementById("notificacionCircularGranja").style.visibility = "hidden"
        document.getElementById("notificacionCircularTaberna").style.visibility = "hidden"
        if (almacenExiste) {
            document.getElementById("newAlmacen").style.visibility = "hidden"
            document.getElementById("newChoza").style.visibility = "visible"
            document.getElementById("newMercado").style.visibility = "visible"
            document.getElementById("newGranja").style.visibility = "visible"
            desbloquear("#botonMercado")
            desbloquear("#botonChoza")
            desbloquear("#botonGranja")
            document.getElementsByClassName("contenedorRecursos")[0].style.display = "flex"
            document.getElementsByClassName("contenedorRecursos")[1].style.display = "flex"
            desbloquear("#botonRecolectar")
            document.getElementById("botonRecolectar").onclick = () => { recolectar() }
            desbloquear("#botonAlmacen")
            document.getElementById("botonAlmacen").onclick = () => { activarAlmacen() }
            if (trabajadores > 0) document.getElementById("newChoza").style.visibility = "hidden"
            if (mercadoExiste) document.getElementById("newMercado").style.visibility = "hidden"
            if (granjaExiste) {
                document.getElementById("notificacionCircularGranja").style.visibility = "visible"
                document.getElementById("newGranja").style.visibility = "hidden"
                clearInterval(intervaloTrigo)
                let resta = trabajadores * 200
                if (resta >= 15000) resta = 14000
                let contador = 15 - trabajadores * 0.2
                document.getElementById("notificacionCircularGranja").textContent = contador
                intervaloContadorTrigo = setInterval(() => {
                    contador--
                    if (trabajadores >= 70) {
                        contador = 1
                        document.getElementById("notificacionCircularGranja").textContent = "Ꝏ"
                        clearInterval(intervaloContadorTrigo)
                    } else {
                        if (contador == 0) contador = 15 - trabajadores * 0.2
                        document.getElementById("notificacionCircularGranja").textContent = contador
                    }
                }, 1000)
                intervaloTrigo = setInterval(() => {
                    trigo++
                    actualizarRecursos()
                    comprobarRecursos()
                }, 15000 - resta)
            }
            if (granjaExiste && !establoExiste) {
                document.getElementById("newEstablo").style.visibility = "visible"
                desbloquear("#botonEstablo")
            }
            if (establoExiste) desbloquear("#botonEstablo")
            if (establoExiste && !molinoExiste) {
                document.getElementById("newMolino").style.visibility = "visible"
                desbloquear("#botonMolino")
            }
            if (molinoExiste) desbloquear("#botonMolino")
            if (molinoExiste && !tabernaExiste) {
                document.getElementById("newTaberna").style.visibility = "visible"
                desbloquear("#botonTaberna")
            }
            if (tabernaExiste) {
                document.getElementById("notificacionCircularTaberna").style.visibility = "visible"
                desbloquear("#botonTaberna")
                clearInterval(intervaloBerry)
                let contador = 60
                document.getElementById("notificacionCircularTaberna").textContent = contador
                setInterval(() => {
                    contador--
                    if (contador == 0) contador = 60
                    document.getElementById("notificacionCircularTaberna").textContent = contador
                }, 1000)
                intervaloBerry = setInterval(() => {
                    berry += 10
                    actualizarRecursos()
                    comprobarRecursos()
                }, 60000)
            }
            if (tabernaExiste && !muelleExiste) {
                document.getElementById("newMuelle").style.visibility = "visible"
                desbloquear("#botonMuelle")
            }
            if (muelleExiste) {
                desbloquear("#botonMuelle")
                habilitarMapa()
                document.getElementById("botonNavegar").style.visibility = "visible"
            }
            actualizarRecursos()
            comprobarRecursos()
        } else if (!almacenExiste && berry >= 2) {
            desbloquear("#botonAlmacen")
            document.getElementById("newAlmacen").style.visibility = "visible"
            document.getElementById("botonAlmacen").onclick = () => { activarAlmacen() }
            actualizarRecursos()
            comprobarRecursos()
        }
    }
}

// FUNCIONES

function generarBerry() {
    if (berry < 1 && !edificiosExiste) {
        mensaje("Has conseguido tu primer beli\n\nRecuerda que cuando quieras descansar\ny volver en otro momento tu progreso\nse guarda automaticamente, solo deberas\npulsar en cargar partida\n\nSi deseas empezar deesde cero\npulsa en nueva partida\n\nPor cierto, si no cierras la aplicacion\nseguiremos trabajando en segundo plano\n\nDicho esto, vayamos a por otro berry!!")
    }
    document.querySelector(".audioClick").play()
    animacion("botonBerry")
    document.querySelector("#botonBerry p").textContent = "Generando..."
    document.getElementById("botonBerry").onclick = () => { }
    setTimeout(() => {
        berry++
        document.querySelector("#botonBerry p").textContent = "Berry"
        document.getElementById("botonBerry").onclick = () => { generarBerry() }
        actualizarRecursos()
        comprobarRecursos()
        if (berry == 2 && !almacenExiste) {
            edificiosExiste = true
            localStorage.setItem("edificiosExiste", edificiosExiste)
            desbloquear("#botonAlmacen")
            document.getElementById("newAlmacen").style.visibility = "visible"
            document.getElementById("seccionConstrucciones").style.display = "flex"
            localStorage.setItem("displayConstrucciones", "visible")
            document.getElementById("seccionAldea").style.display = "none"
            mensaje("Has desbloqueado la seccion\nde construcciones!\n\nAhora podras ver los edificios que debes\nconstruir e interactuar con ellos . . .\n\n¡Muy bien hecho!\n¿Como, que ha sido gracias a mi ayuda?\nDecir eso no me hara nada feliz, cabron")
            document.getElementById("botonConstrucciones").style.visibility = "visible"
            pulsarConstrucciones()
            document.getElementById("botonAlmacen").onclick = () => { activarAlmacen() }
        }
    }, 250 * berry)
}

function recolectar() {
    document.querySelector(".audioClick").play()
    document.getElementById("botonRecolectar").onclick = () => { }
    animacion("botonRecolectar")
    let contador = 45 - trabajadores
    if (contador < 0) contador = 0
    document.querySelector("#botonRecolectar p").textContent = "Recogiendo... " + contador + "s"
    document.getElementById("botonRecolectar").onclick = () => { }
    if (contador > 0) {
        let intervalo = setInterval(() => {
            contador--
            document.querySelector("#botonRecolectar p").textContent = "Recogiendo... " + contador + "s"
            if (contador == 0) clearInterval(intervalo)
        }, 1000)
    }
    setTimeout(() => {
        piedras += Math.floor(Math.random() * (trabajadores + 5))
        madera += Math.floor(Math.random() * (trabajadores + 5))
        actualizarRecursos()
        comprobarRecursos()
        document.querySelector("#botonRecolectar p").textContent = "Recolectar"
        document.getElementById("botonRecolectar").onclick = () => { recolectar() }
    }, (45000 - trabajadores * 1000))
    // berry = 999
    // madera = 999
    // piedras = 999
    // trigo = 999
    // cuero = 999
    // caballos = 999
    // pan = 99
    // trabajadores = 30
}

function activarAlmacen() {
    document.querySelector(".audioClick").play()
    animacion("botonAlmacen")
    if (almacenExiste) {
        mensaje("Ya construiste un almacen!\n\nGracias a el puedes almacenar\ntus recursos como puedes\nver en la tabla que ves abajo.")
    } else {
        document.querySelector(".nuevaConstruccion").play()
        document.getElementById("newAlmacen").style.visibility = "hidden"
        document.getElementById("newChoza").style.visibility = "visible"
        document.getElementById("newMercado").style.visibility = "visible"
        document.getElementById("newGranja").style.visibility = "visible"
        berry -= 2
        desbloquear("#botonMercado")
        desbloquear("#botonChoza")
        desbloquear("#botonGranja")
        document.getElementsByClassName("contenedorRecursos")[0].style.display = "flex"
        document.getElementsByClassName("contenedorRecursos")[1].style.display = "flex"
        pulsarAldea()
        almacenExiste = true
        mensaje("¡Ahora puedes recolectar\nrecursos en la aldea!\n\nAdemas, has desbloqueado las\nchozas, el mercado y la granja\nEn la seccion de construccion\n\nPulsa en la interrogacion cuando\nquieras sabes que puedes hacer con\ncada construccion y su coste")
        desbloquear("#botonRecolectar")
        document.getElementById("botonRecolectar").onclick = () => { recolectar() }
        berry = 999
        madera = 999
        piedras = 999
        trigo = 999
        cuero = 999
        caballos = 999
        pan = 999
        trabajadores = 30
        actualizarRecursos()
        comprobarRecursos()
    }
}

function actualizarRecursos() {
    let recursosArr = [berry, madera, piedras, trabajadores, trigo, cuero, caballos, pan]
    let recursosArrString = ["Berry", "Madera", "Piedras", "Trabajadores", "Trigo", "Cuero", "Caballos", "Pan"]
    for (let i = 0; i < recursosArr.length; i++) {
        localStorage.setItem(recursosArrString[i], recursosArr[i])
        document.querySelectorAll(`.div${recursosArrString[i]} p`)[0].textContent = `${recursosArr[i]}`
        document.querySelectorAll(`.div${recursosArrString[i]} p`)[1].textContent = `${recursosArr[i]}`
    }
    //GUARDA DATOS DE ACTUALIZACION EN LOCALSTORAGE
    localStorage.setItem("almacenExiste", almacenExiste)
    localStorage.setItem("mercadoExiste", mercadoExiste)
    localStorage.setItem("granjaExiste", granjaExiste)
    localStorage.setItem("establoExiste", establoExiste)
    localStorage.setItem("molinoExiste", molinoExiste)
    localStorage.setItem("tabernaExiste", tabernaExiste)
    localStorage.setItem("muelleExiste", muelleExiste)
    localStorage.setItem("edificiosExiste", edificiosExiste)
    localStorage.setItem("costeChoza", costeChoza)
}

function comprobarRecursos() { //COMPRUEBA QUE BOTONES SE ACTIVAN SEGUN LOS RECURSOS QUE TENGAS
    if (almacenExiste == true) {
        if (berry < costeChoza || piedras < costeChoza) {
            document.querySelector("#botonChoza div").style.display = "block"
            document.getElementById("botonChoza").onclick = () => { mensaje("No tienes suficientes recursos"); animacion("botonChoza") }
        } else {
            document.querySelector("#botonChoza div").style.display = "none"
            document.getElementById("botonChoza").onclick = () => { construirChoza() }
        }

        if ((berry < 6 || piedras < 9 || madera < 5) && !granjaExiste) {
            document.querySelector("#botonGranja div").style.display = "block"
            document.getElementById("botonGranja").onclick = () => { mensaje("No tienes suficientes recursos"); animacion("botonGranja") }
        } else {
            document.querySelector("#botonGranja div").style.display = "none"
            document.getElementById("botonGranja").onclick = () => { construirGranja() }
        }

        if ((piedras < 8 || madera < 9) && !mercadoExiste) {
            document.querySelector("#botonMercado div").style.display = "block"
            document.getElementById("botonMercado").onclick = () => { mensaje("No tienes suficientes recursos"); animacion("botonMercado") }
        } else {
            document.querySelector("#botonMercado div").style.display = "none"
            document.getElementById("botonMercado").onclick = () => { construirMercado() }
        }
    }

    if (granjaExiste) {
        if ((berry < 5 || madera < 10 || trigo < 5) && !establoExiste) {
            document.querySelector("#botonEstablo div").style.display = "block"
            document.getElementById("botonEstablo").onclick = () => { mensaje("No tienes suficientes recursos"); animacion("botonEstablo") }
        } else {
            document.querySelector("#botonEstablo div").style.display = "none"
            document.getElementById("botonEstablo").onclick = () => { construirEstablo() }
        }
    }

    if (establoExiste) {
        if ((berry < 5 || piedras < 8 || caballos < 3) && !molinoExiste) {
            document.querySelector("#botonMolino div").style.display = "block"
            document.getElementById("botonMolino").onclick = () => { mensaje("No tienes suficientes recursos"); animacion("botonMolino") }
        } else {
            document.querySelector("#botonMolino div").style.display = "none"
            document.getElementById("botonMolino").onclick = () => { construirMolino() }
        }
    }

    if (molinoExiste) {
        if ((berry < 10 || madera < 7 || piedras < 9 || caballos < 3 || pan < 10) && !tabernaExiste) {
            document.querySelector("#botonTaberna div").style.display = "block"
            document.getElementById("botonTaberna").onclick = () => { mensaje("No tienes suficientes recursos"); animacion("botonTaberna") }
        } else {
            document.querySelector("#botonTaberna div").style.display = "none"
            document.getElementById("botonTaberna").onclick = () => { construirTaberna() }
        }
    }

    if (tabernaExiste) {
        if ((berry < 50 || madera < 200 || piedras < 200 || trabajadores < 30) && !muelleExiste) {
            document.querySelector("#botonMuelle div").style.display = "block"
            document.getElementById("botonMuelle").onclick = () => { mensaje("No tienes suficientes recursos"); animacion("botonMuelle") }
        } else {
            document.querySelector("#botonMuelle div").style.display = "none"
            document.getElementById("botonMuelle").onclick = () => { construirMuelle() }
        }
    }

}

function construirChoza() {
    document.querySelector(".nuevaConstruccion").play()
    document.querySelector(".audioClick").play()
    document.getElementById("newChoza").style.visibility = "hidden"
    animacion("botonChoza")
    berry -= costeChoza
    piedras -= costeChoza
    trabajadores += 5
    costeChoza += 5
    mensaje("Has construido una choza!")
    if (granjaExiste) {
        clearInterval(intervaloTrigo)
        clearInterval(intervaloContadorTrigo)
        let resta = trabajadores * 200
        if (resta >= 14000) resta = 14000
        let contador = 15 - trabajadores * 0.2
        document.getElementById("notificacionCircularGranja").textContent = contador
        intervaloContadorTrigo = setInterval(() => {
            contador--
            if (trabajadores >= 70) {
                contador = 1
                document.getElementById("notificacionCircularGranja").textContent = "x"
                clearInterval(intervaloContadorTrigo)
            } else {
                if (contador == 0) contador = 15 - trabajadores * 0.2
                document.getElementById("notificacionCircularGranja").textContent = contador
            }
        }, 1000)
        intervaloTrigo = setInterval(() => {
            trigo++
            actualizarRecursos()
            comprobarRecursos()
        }, 15000 - resta)
    }
    actualizarRecursos()
    comprobarRecursos()
}

function construirGranja() {
    document.querySelector(".audioClick").play()
    animacion("botonGranja")
    if (granjaExiste) {
        mensaje("Tienes una granja!\nObtendras 1 de trigo cada 15 segundos\nPor cada trabajador tarda 0.2 seg menos")
    } else {
        document.querySelector(".nuevaConstruccion").play()
        document.getElementById("notificacionCircularGranja").style.visibility = "visible"
        document.getElementById("newGranja").style.visibility = "hidden"
        berry -= 6
        piedras -= 9
        madera -= 5
        granjaExiste = true
        let resta = trabajadores * 200
        if (resta >= 15000) resta = 14000
        let contador = 15 - trabajadores * 0.2
        document.getElementById("notificacionCircularGranja").textContent = contador
        intervaloContadorTrigo = setInterval(() => {
            contador--
            if (trabajadores >= 70) {
                contador = 1
                document.getElementById("notificacionCircularGranja").textContent = "x"
                clearInterval(intervaloContadorTrigo)
            } else {
                if (contador == 0) contador = 15 - trabajadores * 0.2
                document.getElementById("notificacionCircularGranja").textContent = contador
            }
        }, 1000)
        intervaloTrigo = setInterval(() => {
            trigo++
            actualizarRecursos()
            comprobarRecursos()
        }, 15000 - resta)
        desbloquear("#botonEstablo")
        document.getElementById("newEstablo").style.visibility = "visible"
        mensaje("Tienes una granja!\nObtendras 1 de trigo cada 15 segundos\nPor cada trabajador tarda 1seg menos\nAdemas, ya puedes construir el establo")
        actualizarRecursos()
        comprobarRecursos()
    }
}

function construirMercado() {
    document.querySelector(".audioClick").play()
    animacion("botonMercado")
    if (mercadoExiste == true) {
        mensajeMercado("Compra madera y piedra por 1 berry\nEl cuero cuesta 3 berry\nEl pan cuesta 15 berry")
        objetosMercado()
    } else {
        document.querySelector(".nuevaConstruccion").play()
        activarBotonesCantidadesMercado()
        document.getElementById("newMercado").style.visibility = "hidden"
        piedras -= 8
        madera -= 9
        mercadoExiste = true
        mensaje("Has desbloqueado el mercado\n\naqui encontraras algunos recursos si\nlos necesitas pero suelta berry que no\nse regalan pulsando botones!")
    }
    actualizarRecursos()
    comprobarRecursos()
}

function construirEstablo() {
    document.querySelector(".audioClick").play()
    animacion("botonEstablo")
    if (establoExiste) {
        mensajeEdificios("Criar", "Coste: 2 cuero - 10 trigo")
        document.getElementById("botonVentana").onclick = () => {
            animacion("botonVentana")
            if (cuero < 2 || trigo < 10) {
                document.getElementsByClassName("notificacionContenedor")[1].style.display = "none"
                mensaje("No tienes suficientes recursos")
            } else {
                cuero -= 2
                trigo -= 10
                caballos++
                cerrarMensajeEdificios()
                mensaje("Has criado un caballo")
                actualizarRecursos()
                comprobarRecursos()
            }
        }
    } else {
        document.querySelector(".nuevaConstruccion").play()
        document.getElementById("newEstablo").style.visibility = "hidden"
        establoExiste = true
        berry -= 5
        madera -= 10
        trigo -= 5
        mensaje("Ahora puedes criar caballos\n\nRecuerda que son seres vivos, no los\ntrates como una variable de JS!\nPor cierto, ya puedes construir\nun molino")
        desbloquear("#botonMolino")
        document.getElementById("newMolino").style.visibility = "visible"
        actualizarRecursos()
        comprobarRecursos()
    }
}

function construirMolino() {
    document.querySelector(".audioClick").play()
    animacion("botonMolino")
    if (molinoExiste) {
        mensajeEdificios("Amasar", "Coste: 2 trigo\nSon necesarios 10 trabajadores")
        document.getElementById("botonVentana").onclick = () => {
            animacion("botonVentana")
            if (trigo < 2 || trabajadores < 10) {
                document.getElementsByClassName("notificacionContenedor")[1].style.display = "none"
                mensaje("No tienes suficientes recursos")
            } else {
                trigo -= 2
                pan++
                cerrarMensajeEdificios()
                mensaje("Has amasado pan")
                actualizarRecursos()
                comprobarRecursos()
            }
        }
    } else {
        document.querySelector(".nuevaConstruccion").play()
        document.getElementById("newMolino").style.visibility = "hidden"
        molinoExiste = true
        berry -= 5
        piedras -= 8
        caballos -= 3
        mensaje("Gigante a la vista como\ndiría Don Quijote...\n\nAhora puedes amasar pan en el molino\nrecuerda que necesitas 10 trabajadores.\n\nPor cierto, ahora puedes constuir\ntu propia taberna")
        desbloquear("#botonTaberna")
        document.getElementById("newTaberna").style.visibility = "visible"
        actualizarRecursos()
        comprobarRecursos()
    }
}

function construirTaberna() {
    document.querySelector(".audioClick").play()
    animacion("botonTaberna")
    if (tabernaExiste) {
        mensaje("Ganaras berry de forma automatica\ngracias a las ventas de tu taberna\n\n10 berry cada minuto")
    } else {
        document.querySelector(".nuevaConstruccion").play()
        document.getElementById("notificacionCircularTaberna").style.visibility = "visible"
        document.getElementById("newTaberna").style.visibility = "hidden"
        tabernaExiste = true
        berry -= 10
        madera -= 7
        piedras -= 9
        caballos -= 3
        pan -= 10
        let contador = 60
        document.getElementById("notificacionCircularTaberna").textContent = contador
        setInterval(() => {
            contador--
            if (contador == 0) contador = 60
            document.getElementById("notificacionCircularTaberna").textContent = contador
        }, 1000)
        intervaloBerry = setInterval(() => {
            berry += 10
            actualizarRecursos()
            comprobarRecursos()
        }, 60000)
        mensaje("Has conseguido construir\ntu propia taberna\n\nA partir de ahora ganaras berry\nde forma automatica gracias a\nlas ventas de tu taberna")
        desbloquear("#botonMuelle")
        document.getElementById("newMuelle").style.visibility = "visible"
        actualizarRecursos()
        comprobarRecursos()
    }
}

function construirMuelle() {
    document.querySelector(".audioClick").play()
    animacion("botonMuelle")
    if (muelleExiste) {
        mensaje("Gracias al muelle puedes construir\ntu propio barco y salir a navegar\n\nNO DISPONIBLE EN DEMO")
        habilitarMapa()
    } else {
        document.querySelector(".nuevaConstruccion").play()
        let tiempoTardado = document.getElementsByClassName("contador")[0].textContent
        // document.querySelectorAll(".txt pre")[0].textContent = "\nHas completado la demo en " + tiempoTardado
        document.getElementById("newMuelle").style.visibility = "hidden"
        muelleExiste = true
        berry -= 50
        madera -= 200
        piedras -= 200
        mensaje("Por fin tienes un muelle!\n\nEs hora de conseguir el barco\nRecolecta lo necesario para ello\nya no queda nada para poder navegar")
        //abrir muelle
        document.getElementById("botonNavegar").style.visibility = "visible"
        habilitarMapa()
        localStorage.setItem("displayConstrucciones", "visible")
        actualizarRecursos()
        comprobarRecursos()
    }
}

function reestablecerCantidades() {
    cantidadPiedras = 1
    cantidadMadera = 1
    cantidadCuero = 1
    cantidadPan = 1
    document.getElementById("cantidadPiedras").textContent = 1
    document.getElementById("cantidadMadera").textContent = 1
    document.getElementById("cantidadCuero").textContent = 1
    document.getElementById("cantidadPan").textContent = 1
}

function objetosMercado() {
    document.getElementById("botonVentanaPiedra").onclick = () => {
        animacion("botonVentanaPiedra")
        if (berry < (1 * cantidadPiedras)) {
            mensaje("No tienes suficientes recursos")
            document.getElementsByClassName("notificacionContenedor")[2].style.display = "none"
        } else {
            document.getElementsByClassName("notificacionContenedor")[2].style.display = "none"
            mensaje("Has comprado " + cantidadPiedras + " piedra")
            piedras += 1 * cantidadPiedras
            berry -= 1 * cantidadPiedras
            actualizarRecursos()
            comprobarRecursos()
        }
        reestablecerCantidades()
    }
    document.getElementById("botonVentanaMadera").onclick = () => {
        document.querySelector(".audioClick").play()
        animacion("botonVentanaMadera")
        if (berry < (1 * cantidadMadera)) {
            mensaje("No tienes suficientes recursos")
            document.getElementsByClassName("notificacionContenedor")[2].style.display = "none"
        } else {
            document.getElementsByClassName("notificacionContenedor")[2].style.display = "none"
            mensaje("Has comprado " + cantidadMadera + " madera")
            madera += 1 * cantidadMadera
            berry -= 1 * cantidadMadera
            actualizarRecursos()
            comprobarRecursos()
        }
        reestablecerCantidades()
    }
    document.getElementById("botonVentanaCuero").onclick = () => {
        document.querySelector(".audioClick").play()
        animacion("botonVentanaCuero")
        if (berry < (3 * cantidadCuero)) {
            mensaje("No tienes suficientes recursos")
            document.getElementsByClassName("notificacionContenedor")[2].style.display = "none"
        } else {
            document.getElementsByClassName("notificacionContenedor")[2].style.display = "none"
            mensaje("Has comprado " + cantidadCuero + " cuero")
            cuero += 1 * cantidadCuero
            berry -= 3 + cantidadCuero
            actualizarRecursos()
            comprobarRecursos()
        }
        reestablecerCantidades()
    }
    document.getElementById("botonVentanaPan").onclick = () => {
        document.querySelector(".audioClick").play()
        animacion("botonVentanaPan")
        if ((berry < (15 * cantidadPan)) && molinoExiste) {
            mensaje("No tienes suficientes recursos")
            document.getElementsByClassName("notificacionContenedor")[2].style.display = "none"
        } else if (!molinoExiste) {
            mensaje("No puedes comprar pan antes de\nhaber construido el molino")
            document.getElementsByClassName("notificacionContenedor")[2].style.display = "none"
            reestablecerCantidades()
        } else {
            document.getElementsByClassName("notificacionContenedor")[2].style.display = "none"
            mensaje("Has comprado " + cantidadPan + " pan")
            pan += 1 * cantidadPan
            berry -= 15 * cantidadPan
            cantidadPan = 1
            actualizarRecursos()
            comprobarRecursos()
        }
        reestablecerCantidades()
    }
}

function activarBotonesCantidadesMercado() {
    cantidadPiedras = 1
    cantidadMadera = 1
    cantidadCuero = 1
    cantidadPan = 1
    document.getElementById("cantidadPiedras").textContent = 1
    document.getElementById("cantidadMadera").textContent = 1
    document.getElementById("cantidadCuero").textContent = 1
    document.getElementById("cantidadPan").textContent = 1

    document.getElementById("+piedra").onclick = () => {
        animacion("+piedra")
        if (cantidadPiedras < 99) {
            cantidadPiedras++
            document.getElementById("cantidadPiedras").textContent = cantidadPiedras
        }
    }
    document.getElementById("-piedra").onclick = () => {
        animacion("-piedra")
        if (cantidadPiedras > 1) {
            cantidadPiedras--
            document.getElementById("cantidadPiedras").textContent = cantidadPiedras
        }
    }

    document.getElementById("+madera").onclick = () => {
        animacion("+madera")
        if (cantidadMadera < 99) {
            cantidadMadera++
            document.getElementById("cantidadMadera").textContent = cantidadMadera
        }
    }
    document.getElementById("-madera").onclick = () => {
        animacion("-madera")
        if (cantidadMadera > 1) {
            cantidadMadera--
            document.getElementById("cantidadMadera").textContent = cantidadMadera
        }
    }

    document.getElementById("+cuero").onclick = () => {
        animacion("+cuero")
        if (cantidadCuero < 99) {
            cantidadCuero++
            document.getElementById("cantidadCuero").textContent = cantidadCuero
        }
    }
    document.getElementById("-cuero").onclick = () => {
        animacion("-cuero")
        if (cantidadCuero > 1) {
            cantidadCuero--
            document.getElementById("cantidadCuero").textContent = cantidadCuero
        }
    }

    document.getElementById("+pan").onclick = () => {
        animacion("+pan")
        if (cantidadPan < 99) {
            cantidadPan++
            document.getElementById("cantidadPan").textContent = cantidadPan
        }
    }
    document.getElementById("-pan").onclick = () => {
        animacion("-pan")
        if (cantidadPan > 1) {
            cantidadPan--
            document.getElementById("cantidadPan").textContent = cantidadPan
        }
    }
}

function ocultarNew() {
    for (let i = 0; i < document.getElementsByClassName("new2").length; i++) {
        document.getElementsByClassName("new2")[i].style.visibility = "hidden"
    }

    for (let i = 0; i < document.getElementsByClassName("new").length; i++) {
        document.getElementsByClassName("new")[i].style.visibility = "hidden"
    }
}

function desbloquear(elem) {
    if (elem == "#botonRecolectar") {
        document.querySelector("#botonRecolectar .noComprado").remove()
        document.querySelector("#botonRecolectar .bloqueado").remove()
    } else {
        document.querySelector(elem).removeChild(document.querySelector(elem).firstElementChild)
    }
    comprobarRecursos()
}

function animacion(elem) {
    document.getElementById(elem).style.animation = "pulsado 0.3s"
    setTimeout(() => {
        document.getElementById(elem).style.animation = ""
    }, 300);
}

function mensaje(msj) {
    document.getElementById("contenedor1").style.display = "flex"
    document.getElementById("msjNormal").textContent = msj
}

function mensajeEdificios(accion, msj) {
    document.getElementById("contenedor2").style.display = "flex"
    document.getElementById("mensajeVentana").textContent = msj
    document.getElementById("botonVentana").textContent = accion
}

function mensajeMercado(msj) {
    document.getElementById("contenedor3").style.display = "flex"
    document.getElementById("mensajeVentanaMercado").textContent = msj
}

function cerrarMensaje() {
    document.querySelector(".audioClick").play()
    document.getElementById("contenedor1").style.display = "none"
}

function cerrarMensajeEdificios() {
    document.querySelector(".audioClick").play()
    document.getElementById("contenedor2").style.display = "none"
}

function cerrarMensajeMercado() {
    document.querySelector(".audioClick").play()
    document.getElementById("contenedor3").style.display = "none"
    reestablecerCantidades()
}

function bloquarPulsadores() {
    for (let i = 0; i < document.querySelectorAll(".pulsadores").length; i++) {
        document.querySelectorAll(".pulsadores")[i].onclick = () => {
            document.querySelectorAll(".pulsadores")[i].style.animation = "pulsado 0.3s"
            setTimeout(() => {
                document.querySelectorAll(".pulsadores")[i].style.animation = ""
            }, 300);
            mensaje("Parece que aun no has\ndesbloqueado esta funcion . . .\n¿Que tal si sigues investigando?")
        }
    }

    for (let i = 0; i < document.querySelectorAll(".pulsadores2").length; i++) {
        document.querySelectorAll(".pulsadores2")[i].onclick = () => {
            document.querySelectorAll(".pulsadores2")[i].style.animation = "pulsado 0.3s"
            setTimeout(() => {
                document.querySelectorAll(".pulsadores2")[i].style.animation = ""
            }, 300);
            mensaje("Parece que aun no has\ndesbloqueado esta funcion . . .\n¿Que tal si sigues investigando?")
        }
    }
}

function pulsarConstrucciones() {
    document.getElementById("seccionAldea").style.display = "none"
    document.getElementById("seccionNavegar").style.display = "none"
    document.getElementById("seccionConstrucciones").style.display = "flex"

    document.querySelector("#botonConstrucciones .mainImg").style.height = "110%"
    document.querySelector("#botonAldea .mainImg").style.height = "80%"
    document.querySelector("#botonNavegar .mainImg").style.height = "80%"

    document.getElementById("botonConstrucciones").style.marginTop = "0"
    document.getElementById("botonConstrucciones").style.borderTopWidth = "1.88em"
    document.getElementById("botonAldea").style.marginTop = "1.5em"
    document.getElementById("botonAldea").style.borderTopWidth = "6px"
    document.getElementById("botonNavegar").style.marginTop = "1.5em"
    document.getElementById("botonNavegar").style.borderTopWidth = "6px"
}

function pulsarAldea() {
    document.getElementById("seccionAldea").style.display = "flex"
    document.getElementById("seccionNavegar").style.display = "none"
    document.getElementById("seccionConstrucciones").style.display = "none"

    document.querySelector("#botonAldea .mainImg").style.height = "110%"
    document.querySelector("#botonConstrucciones .mainImg").style.height = "80%"
    document.querySelector("#botonNavegar .mainImg").style.height = "80%"

    document.getElementById("botonAldea").style.marginTop = "0"
    document.getElementById("botonAldea").style.borderTopWidth = "1.88em"
    document.getElementById("botonConstrucciones").style.marginTop = "1.5em"
    document.getElementById("botonConstrucciones").style.borderTopWidth = "6px"
    document.getElementById("botonNavegar").style.marginTop = "1.5em"
    document.getElementById("botonNavegar").style.borderTopWidth = "6px"
}

function pulsarNavegar() {
    document.getElementById("seccionAldea").style.display = "none"
    document.getElementById("seccionNavegar").style.display = "flex"
    document.getElementById("seccionConstrucciones").style.display = "none"

    document.querySelector("#botonNavegar .mainImg").style.height = "110%"
    document.querySelector("#botonConstrucciones .mainImg").style.height = "80%"
    document.querySelector("#botonAldea .mainImg").style.height = "80%"

    document.getElementById("botonNavegar").style.marginTop = "0"
    document.getElementById("botonNavegar").style.borderTopWidth = "1.88em"
    document.getElementById("botonAldea").style.marginTop = "1.5em"
    document.getElementById("botonAldea").style.borderTopWidth = "6px"
    document.getElementById("botonConstrucciones").style.marginTop = "1.5em"
    document.getElementById("botonConstrucciones").style.borderTopWidth = "6px"
}

function cargarInterfaz() {
    document.getElementsByClassName("contenedorRecursos")[0].style.display = "none"
    document.getElementsByClassName("contenedorRecursos")[1].style.display = "none"
    document.getElementById("botonConstrucciones").style.visibility = "hidden"
    document.getElementById("botonNavegar").style.visibility = "hidden"

    document.getElementById("elegirPartida").style.display = "none"
    document.getElementById("seccionAldea").style.display = "flex"
    document.querySelector("#botonAldea .mainImg").style.height = "110%"
    document.getElementById("botonAldea").style.marginTop = "0"
    document.getElementById("botonAldea").style.borderTopWidth = "1.88em"

    document.getElementById("botonConstrucciones").onclick = () => {
        document.querySelector(".audioClick").play()
        pulsarConstrucciones()
    }

    document.getElementById("botonAldea").onclick = () => {
        document.querySelector(".audioClick").play()
        pulsarAldea()
    }

    document.getElementById("botonNavegar").onclick = () => {
        document.querySelector(".audioClick").play()
        pulsarNavegar()
    }
}

function mensajesDeInformacion() {
    for (let i = 0; i < document.getElementsByClassName("infoImg").length; i++) {
        document.getElementsByClassName("infoImg")[i].onclick = () => {
            switch (document.getElementsByClassName("infoImg")[i].id) {
                case "infoBerry":
                    mensaje("Genera un Berry a los 0.25 segundos\n\nCuantos mas tengas, mas tardan\nen generarse asi que no ahorres muchos\n\n(0.25 x Berry) segundos")
                    break;
                case "infoRecolectar":
                    mensaje("Recoge piedra y madera\n\nSi estas solo tardaras 45 seg y solo\npodras recoger entre 0 y 5 de cada\n\nApresurate en construir chozas para\ntener trabajadores que reduzcan el\ntiempo y aumenten la cantidad\n\nDuracion\n45 seg menos cantidad de trabajadores\n\nCantidad generada\nAleatoria entre 0 y trabajadores+5")
                    break;
                case "infoAlmacen":
                    mensaje("ALMACEN\n\nCoste:\n2 berry\n\nPodras almacenar recursos")
                    break;
                case "infoChoza":
                    mensaje(`CHOZA\n\nCoste:\n${costeChoza} berry - ${costeChoza} piedras\n\nCada choza da 5 trabajadores\nNo hay limite de chozas\nCada choza construida aumenta\nel coste de construccion`)
                    break;
                case "infoMercado":
                    mensaje("MERCADO\n\nCoste:\n9 madera - 8 piedras\n\nPodras comprar recursos a cabio\nde algunos berry")
                    break;
                case "infoGranja":
                    mensaje("GRANJA\n\nCoste:\n6 berry - 9 piedras - 5 madera\n\nPermite ganar trigo y construir\nun establo")
                    break;
                case "infoEstablo":
                    mensaje("ESTABLO\n\nCoste:\n8 berry - 10 madera - 5 trigo\n\nPermite criar caballos")
                    break;
                case "infoMolino":
                    mensaje("MOLINO\n\nCoste:\n5 berry - 8 piedras - 3 caballos\n\nPermite amasar pan")
                    break;
                case "infoTaberna":
                    mensaje("TABERNA\n\nCoste:\n10 berry - 7 madera - 9 piedras\n3 caballos - 10 pan\n\nRecauda berry de tus clientes")
                    break;
                case "infoMuelle":
                    mensaje("MUELLE\n\nCoste:\n50 berry - 200 madera\n200 piedras - 30 trabajadores\n\nPermite construir un barco para navegar")
                    break;
                default:
                    break;
            }

            document.getElementsByClassName("infoImg")[i].style.animation = "pulsado 0.3s"
            setTimeout(() => {
                document.getElementsByClassName("infoImg")[i].style.animation = ""
            }, 300);
        }
    }
}

function controladorAudio() {
    if (document.getElementsByClassName("controlesAudio")[0].id == "on") {
        document.getElementById("imgAudio").setAttribute("src", "./media/audioOff.png")
        document.getElementsByTagName("audio")[0].pause()
        document.getElementsByClassName("controlesAudio")[0].id = "off"
    } else {
        document.getElementById("imgAudio").setAttribute("src", "./media/audioOn.png")
        document.getElementsByTagName("audio")[0].play()
        document.getElementsByClassName("controlesAudio")[0].id = "on"
    }
}

function activarContador(partida) {
    let horas
    let min
    let seg
    if (partida == "nueva") {
        horas = 0
        min = 0
        seg = 0
        document.getElementsByClassName("contador")[0].textContent = `0h 0m 0s`
    } else {
        horas = parseInt(localStorage.getItem("horas"))
        min = parseInt(localStorage.getItem("min"))
        seg = parseInt(localStorage.getItem("seg"))
        document.getElementsByClassName("contador")[0].textContent = `${horas}h ${min}m ${seg}s`
    }
    setInterval(() => {
        seg++
        if (seg == 60) {
            seg = 0
            min++
        }
        if (min == 60) {
            min = 0
            horas++
        }
        document.getElementsByClassName("contador")[0].textContent = `${horas}h ${min}m ${seg}s`
        localStorage.setItem("horas", horas)
        localStorage.setItem("min", min)
        localStorage.setItem("seg", seg)
    }, 1000)
}

function funcionalidadMensajes() {
    document.getElementById("acep1").onclick = () => { cerrarMensaje() }
    document.getElementById("notific1").onclick = () => { cerrarMensaje() }
    document.getElementById("acep2").onclick = () => { cerrarMensajeEdificios() }
    document.getElementById("notific2").onclick = () => { cerrarMensajeEdificios() }
    document.getElementById("acep3").onclick = () => { cerrarMensajeMercado() }
    document.getElementById("notific3").onclick = () => { cerrarMensajeMercado() }
}

function habilitarMapa() {
    document.getElementById("botonMapa").onclick = () => {
        animacion("botonMapa")
        zoom = 100
        document.getElementById("contenedorMapa").style.zoom = zoom + "%"
        document.getElementById("contenedorMapa").style.display = "flex"
        document.getElementById("fondoNegroMapa").style.display = "block"

        document.getElementById("fondoNegroMapa").onclick = () => {
            document.getElementById("contenedorMapa").style.display = "none"
            document.getElementById("fondoNegroMapa").style.display = "none"
            zoom = 100
        }
        document.getElementById("botonSalir").onclick = () => {
            document.getElementById("contenedorMapa").style.display = "none"
            document.getElementById("fondoNegroMapa").style.display = "none"
            zoom = 100
        }
        document.getElementById("botonAmpliar").onclick = () => {
            zoom += 10
            if (zoom >= 100) zoom = 100
            document.getElementById("contenedorMapa").style.zoom = zoom + "%"
        }
        document.getElementById("botonReducir").onclick = () => {
            zoom -= 10
            if (zoom < 50) zoom = 50
            document.getElementById("contenedorMapa").style.zoom = zoom + "%"
        }
        document.getElementById("contenedorMapa").scrollTop = posicionMapaTop
        document.getElementById("contenedorMapa").scrollLeft = posicionMapaLeft
    }
}

function crearElemento(elemento, clase, id, src, texto, padre) {
    let elem = document.createElement(elemento)
    if (clase !== "") elem.setAttribute("class", clase)
    if (id !== "") elem.setAttribute("id", id)
    if (src !== "") elem.setAttribute("src", src)
    if (texto !== "") elem.appendChild(document.createTextNode(texto))
    document.querySelector(padre).appendChild(elem)
}

function maquetarEleccionDePartida() {
    crearElemento("div", "", "elegirPartida", "", "", "body")
    crearElemento("div", "contenedorTitulo", "contenedorTituloElegir", "", "", "#elegirPartida")
    crearElemento("img", "", "", "./media/cartelTitulo.png", "", "#contenedorTituloElegir")
    crearElemento("h1", "", "titulo", "", "PIRATYCOON", "#contenedorTituloElegir")
    crearElemento("div", "pulsadores2", "nueva", "", "", "#elegirPartida")
    crearElemento("img", "imgPulsadores", "", "./media/boton2.png", "", "#nueva")
    crearElemento("p", "parrPulsadores", "parrNueva", "", "Nueva partida", "#nueva")
    crearElemento("div", "pulsadores2", "cargar", "", "", "#elegirPartida")
    crearElemento("img", "imgPulsadores", "", "./media/boton2.png", "", "#cargar")
    crearElemento("p", "parrPulsadores", "parrCargar", "", "Cargar partida", "#cargar")
}

function maquetarMensajes() {
    crearElemento("section", "notificacionContenedor", "contenedor1", "", "", "body")
    crearElemento("section", "notificacionNormal", "notific1", "", "", "#contenedor1")
    crearElemento("div", "mensajeNormal", "msjn1", "", "", "#contenedor1")
    crearElemento("pre", "", "msjNormal", "", "", "#msjn1")
    crearElemento("p", "aceptarNormal", "acep1", "", "Aceptar", "#msjn1")
    crearElemento("img", "", "chopper", "./media/Chopper.webp", "", "#contenedor1")
}

function maquetarVentanas() {
    crearElemento("section", "notificacionContenedor", "contenedor2", "", "", "body")
    crearElemento("section", "notificacionNormal", "notific2", "", "", "#contenedor2")
    crearElemento("div", "mensajeNormal", "msjn2", "", "", "#contenedor2")
    crearElemento("pre", "", "mensajeVentana", "", "", "#msjn2")
    crearElemento("div", "pulsadores2", "botonVentana", "", "", "#msjn2")
    crearElemento("div", "aceptarNormal", "acep2", "", "Volver", "#msjn2")
}

function maquetarVentanaMercado() {
    crearElemento("section", "notificacionContenedor", "contenedor3", "", "", "body")
    crearElemento("section", "notificacionNormal", "notific3", "", "", "#contenedor3")
    crearElemento("div", "mensajeNormal", "msjn3", "", "", "#contenedor3")
    crearElemento("pre", "", "mensajeVentanaMercado", "", "", "#msjn3")

    crearElemento("div", "contenedoresMaterialesMercado", "cmm1", "", "", "#msjn3")
    crearElemento("div", "pulsadores2", "botonVentanaPiedra", "", "", "#cmm1")
    crearElemento("img", "imgPulsadores", "", "./media/boton2.png", "", "#botonVentanaPiedra")
    crearElemento("p", "parrPulsadores", "parrMadera", "", "Piedra", "#botonVentanaPiedra")
    crearElemento("div", "contenedorContadores", "cc1", "", "", "#cmm1")
    crearElemento("div", "botonesCantidadMercado", "+piedra", "", "+", "#cc1")
    crearElemento("div", "cantidadesMaterial", "cantidadPiedras", "", "1", "#cc1")
    crearElemento("div", "botonesCantidadMercado", "-piedra", "", "-", "#cc1")

    crearElemento("div", "contenedoresMaterialesMercado", "cmm2", "", "", "#msjn3")
    crearElemento("div", "pulsadores2", "botonVentanaMadera", "", "", "#cmm2")
    crearElemento("img", "imgPulsadores", "", "./media/boton2.png", "", "#botonVentanaMadera")
    crearElemento("p", "parrPulsadores", "parrMadera", "", "Madera", "#botonVentanaMadera")
    crearElemento("div", "contenedorContadores", "cc2", "", "", "#cmm2")
    crearElemento("div", "botonesCantidadMercado", "+madera", "", "+", "#cc2")
    crearElemento("div", "cantidadesMaterial", "cantidadMadera", "", "1", "#cc2")
    crearElemento("div", "botonesCantidadMercado", "-madera", "", "-", "#cc2")

    crearElemento("div", "contenedoresMaterialesMercado", "cmm3", "", "", "#msjn3")
    crearElemento("div", "pulsadores2", "botonVentanaCuero", "", "", "#cmm3")
    crearElemento("img", "imgPulsadores", "", "./media/boton2.png", "", "#botonVentanaCuero")
    crearElemento("p", "parrPulsadores", "parrMadera", "", "Cuero", "#botonVentanaCuero")
    crearElemento("div", "contenedorContadores", "cc3", "", "", "#cmm3")
    crearElemento("div", "botonesCantidadMercado", "+cuero", "", "+", "#cc3")
    crearElemento("div", "cantidadesMaterial", "cantidadCuero", "", "1", "#cc3")
    crearElemento("div", "botonesCantidadMercado", "-cuero", "", "-", "#cc3")

    crearElemento("div", "contenedoresMaterialesMercado", "cmm4", "", "", "#msjn3")
    crearElemento("div", "pulsadores2", "botonVentanaPan", "", "", "#cmm4")
    crearElemento("img", "imgPulsadores", "", "./media/boton2.png", "", "#botonVentanaPan")
    crearElemento("p", "parrPulsadores", "parrMadera", "", "Pan", "#botonVentanaPan")
    crearElemento("div", "contenedorContadores", "cc4", "", "", "#cmm4")
    crearElemento("div", "botonesCantidadMercado", "+pan", "", "+", "#cc4")
    crearElemento("div", "cantidadesMaterial", "cantidadPan", "", "1", "#cc4")
    crearElemento("div", "botonesCantidadMercado", "-pan", "", "-", "#cc4")

    crearElemento("div", "aceptarNormal", "acep3", "", "Volver", "#msjn3")
}

function maquetarConstruccionesOverflow() {
    crearElemento("div", "pulsadoresConstruccionesContenedor", "edif1", "", "", "#construccionesOverflow")
    crearElemento("img", "infoImg", "infoAlmacen", "./media/info.png", "", "#edif1")
    crearElemento("div", "pulsadores", "botonAlmacen", "", "", "#edif1")
    crearElemento("div", "noComprado", "", "", "", "#botonAlmacen")
    crearElemento("img", "imgPulsadores", "", "./media/marco.jpg", "", "#botonAlmacen")
    crearElemento("img", "edificios", "", "./media/almacen.png", "", "#botonAlmacen")
    crearElemento("img", "new", "newAlmacen", "./media/new.png", "", "#botonAlmacen")

    crearElemento("div", "pulsadoresConstruccionesContenedor", "edif2", "", "", "#construccionesOverflow")

    crearElemento("div", "pulsadores", "botonChoza", "", "", "#edif2")
    crearElemento("img", "bloqueado", "", "./media/bloqueado.png", "", "#botonChoza")
    crearElemento("img", "imgPulsadores", "", "./media/marco.jpg", "", "#botonChoza")
    crearElemento("div", "noComprado", "", "", "", "#botonChoza")
    crearElemento("img", "edificios", "", "./media/choza.png", "", "#botonChoza")
    crearElemento("img", "new2", "newChoza", "./media/new.png", "", "#botonChoza")
    crearElemento("img", "infoImg", "infoChoza", "./media/info.png", "", "#edif2")

    crearElemento("div", "pulsadoresConstruccionesContenedor", "edif3", "", "", "#construccionesOverflow")
    crearElemento("img", "infoImg", "infoMercado", "./media/info.png", "", "#edif3")
    crearElemento("div", "pulsadores", "botonMercado", "", "", "#edif3")
    crearElemento("img", "bloqueado", "", "./media/bloqueado.png", "", "#botonMercado")
    crearElemento("img", "imgPulsadores", "", "./media/marco.jpg", "", "#botonMercado")
    crearElemento("div", "noComprado", "", "", "", "#botonMercado")
    crearElemento("img", "edificios", "", "./media/mercado.png", "", "#botonMercado")
    crearElemento("img", "new", "newMercado", "./media/new.png", "", "#botonMercado")

    crearElemento("div", "pulsadoresConstruccionesContenedor", "edif4", "", "", "#construccionesOverflow")

    crearElemento("div", "pulsadores", "botonGranja", "", "", "#edif4")
    crearElemento("img", "bloqueado", "", "./media/bloqueado.png", "", "#botonGranja")
    crearElemento("img", "imgPulsadores", "", "./media/marco.jpg", "", "#botonGranja")
    crearElemento("div", "noComprado", "", "", "", "#botonGranja")
    crearElemento("img", "edificios", "", "./media/granja.png", "", "#botonGranja")
    crearElemento("img", "new2", "newGranja", "./media/new.png", "", "#botonGranja")
    crearElemento("div", "", "notificacionCircularGranja", "", "", "#botonGranja")
    crearElemento("img", "infoImg", "infoGranja", "./media/info.png", "", "#edif4")

    crearElemento("div", "pulsadoresConstruccionesContenedor", "edif5", "", "", "#construccionesOverflow")
    crearElemento("img", "infoImg", "infoEstablo", "./media/info.png", "", "#edif5")
    crearElemento("div", "pulsadores", "botonEstablo", "", "", "#edif5")
    crearElemento("img", "bloqueado", "", "./media/bloqueado.png", "", "#botonEstablo")
    crearElemento("img", "imgPulsadores", "", "./media/marco.jpg", "", "#botonEstablo")
    crearElemento("div", "noComprado", "", "", "", "#botonEstablo")
    crearElemento("img", "edificios", "", "./media/establo.png", "", "#botonEstablo")
    crearElemento("img", "new", "newEstablo", "./media/new.png", "", "#botonEstablo")

    crearElemento("div", "pulsadoresConstruccionesContenedor", "edif6", "", "", "#construccionesOverflow")

    crearElemento("div", "pulsadores", "botonMolino", "", "", "#edif6")
    crearElemento("img", "bloqueado", "", "./media/bloqueado.png", "", "#botonMolino")
    crearElemento("img", "imgPulsadores", "", "./media/marco.jpg", "", "#botonMolino")
    crearElemento("div", "noComprado", "", "", "", "#botonMolino")
    crearElemento("img", "edificios", "", "./media/molino.png", "", "#botonMolino")
    crearElemento("img", "new2", "newMolino", "./media/new.png", "", "#botonMolino")
    crearElemento("img", "infoImg", "infoMolino", "./media/info.png", "", "#edif6")

    crearElemento("div", "pulsadoresConstruccionesContenedor", "edif7", "", "", "#construccionesOverflow")
    crearElemento("img", "infoImg", "infoTaberna", "./media/info.png", "", "#edif7")
    crearElemento("div", "pulsadores", "botonTaberna", "", "", "#edif7")
    crearElemento("img", "bloqueado", "", "./media/bloqueado.png", "", "#botonTaberna")
    crearElemento("img", "imgPulsadores", "", "./media/marco.jpg", "", "#botonTaberna")
    crearElemento("div", "noComprado", "", "", "", "#botonTaberna")
    crearElemento("img", "edificios", "", "./media/taberna.png", "", "#botonTaberna")
    crearElemento("img", "new", "newTaberna", "./media/new.png", "", "#botonTaberna")
    crearElemento("div", "", "notificacionCircularTaberna", "", "", "#botonTaberna")

    crearElemento("div", "pulsadoresConstruccionesContenedor", "edif8", "", "", "#construccionesOverflow")

    crearElemento("div", "pulsadores", "botonMuelle", "", "", "#edif8")
    crearElemento("img", "bloqueado", "", "./media/bloqueado.png", "", "#botonMuelle")
    crearElemento("img", "imgPulsadores", "", "./media/marco.jpg", "", "#botonMuelle")
    crearElemento("div", "noComprado", "", "", "", "#botonMuelle")
    crearElemento("img", "edificios", "", "./media/muelle.png", "", "#botonMuelle")
    crearElemento("img", "new2", "newMuelle", "./media/new.png", "", "#botonMuelle")
    crearElemento("img", "infoImg", "infoMuelle", "./media/info.png", "", "#edif8")
}

function maquetarRecursos() {
    //Construcciones
    crearElemento("img", "", "panelRecursos", "./media/panelRecursos.png", "", "#recursosConstrucciones")

    crearElemento("section", "", "sectionRecursosConst", "", "", "#recursosConstrucciones")

    crearElemento("div", "divBerry", "constdivBerry", "", "", "#sectionRecursosConst")
    crearElemento("p", "", "", "", "0", "#constdivBerry")
    crearElemento("img", "", "", "./media/b.png", "", "#constdivBerry")

    crearElemento("div", "divMadera", "constdivMadera", "", "", "#sectionRecursosConst")
    crearElemento("p", "", "", "", "0", "#constdivMadera")
    crearElemento("img", "", "", "./media/m.png", "", "#constdivMadera")

    crearElemento("div", "divPiedras", "constdivPiedras", "", "", "#sectionRecursosConst")
    crearElemento("p", "", "", "", "0", "#constdivPiedras")
    crearElemento("img", "", "", "./media/pi.png", "", "#constdivPiedras")

    crearElemento("div", "divTrabajadores", "constdivTrabajadores", "", "", "#sectionRecursosConst")
    crearElemento("p", "", "", "", "0", "#constdivTrabajadores")
    crearElemento("img", "", "", "./media/tra.png", "", "#constdivTrabajadores")

    crearElemento("div", "divTrigo", "constdivTrigo", "", "", "#sectionRecursosConst")
    crearElemento("p", "", "", "", "0", "#constdivTrigo")
    crearElemento("img", "", "", "./media/tri.png", "", "#constdivTrigo")

    crearElemento("div", "divCuero", "constdivCuero", "", "", "#sectionRecursosConst")
    crearElemento("p", "", "", "", "0", "#constdivCuero")
    crearElemento("img", "", "", "./media/cu.png", "", "#constdivCuero")

    crearElemento("div", "divCaballos", "constdivCaballos", "", "", "#sectionRecursosConst")
    crearElemento("p", "", "", "", "0", "#constdivCaballos")
    crearElemento("img", "", "", "./media/ca.png", "", "#constdivCaballos")

    crearElemento("div", "divPan", "constdivPan", "", "", "#sectionRecursosConst")
    crearElemento("p", "", "", "", "0", "#constdivPan")
    crearElemento("img", "", "", "./media/pa.png", "", "#constdivPan")

    //Aldea

    crearElemento("img", "", "panelRecursos", "./media/panelRecursos.png", "", "#recursosAldea")

    crearElemento("section", "", "sectionRecursosAldea", "", "", "#recursosAldea")

    crearElemento("div", "divBerry", "constdivBerry2", "", "", "#sectionRecursosAldea")
    crearElemento("p", "", "", "", "0", "#constdivBerry2")
    crearElemento("img", "", "", "./media/b.png", "", "#constdivBerry2")

    crearElemento("div", "divMadera", "constdivMadera2", "", "", "#sectionRecursosAldea")
    crearElemento("p", "", "", "", "0", "#constdivMadera2")
    crearElemento("img", "", "", "./media/m.png", "", "#constdivMadera2")

    crearElemento("div", "divPiedras", "constdivPiedras2", "", "", "#sectionRecursosAldea")
    crearElemento("p", "", "", "", "0", "#constdivPiedras2")
    crearElemento("img", "", "", "./media/pi.png", "", "#constdivPiedras2")

    crearElemento("div", "divTrabajadores", "constdivTrabajadores2", "", "", "#sectionRecursosAldea")
    crearElemento("p", "", "", "", "0", "#constdivTrabajadores2")
    crearElemento("img", "", "", "./media/tra.png", "", "#constdivTrabajadores2")

    crearElemento("div", "divTrigo", "constdivTrigo2", "", "", "#sectionRecursosAldea")
    crearElemento("p", "", "", "", "0", "#constdivTrigo2")
    crearElemento("img", "", "", "./media/tri.png", "", "#constdivTrigo2")

    crearElemento("div", "divCuero", "constdivCuero2", "", "", "#sectionRecursosAldea")
    crearElemento("p", "", "", "", "0", "#constdivCuero2")
    crearElemento("img", "", "", "./media/cu.png", "", "#constdivCuero2")

    crearElemento("div", "divCaballos", "constdivCaballos2", "", "", "#sectionRecursosAldea")
    crearElemento("p", "", "", "", "0", "#constdivCaballos2")
    crearElemento("img", "", "", "./media/ca.png", "", "#constdivCaballos2")

    crearElemento("div", "divPan", "constdivPan2", "", "", "#sectionRecursosAldea")
    crearElemento("p", "", "", "", "0", "#constdivPan2")
    crearElemento("img", "", "", "./media/pa.png", "", "#constdivPan2")
}

function maquetarAldea() {
    crearElemento("div", "contenedorTitulo", "contTituloAldea", "", "", "#seccionAldea")
    crearElemento("img", "", "", "./media/cartelTitulo.png", "", "#contTituloAldea")
    crearElemento("h2", "", "", "", "ALDEA", "#contTituloAldea")

    crearElemento("div", "pulsadoresConstruccionesContenedor", "pulsaConstCon1", "", "", "#seccionAldea")
    crearElemento("img", "infoImg", "infoBerry", "./media/info.png", "", "#pulsaConstCon1")
    crearElemento("div", "pulsadores2", "botonBerry", "", "", "#pulsaConstCon1")
    crearElemento("img", "imgPulsadores", "", "./media/boton2.png", "", "#botonBerry")
    crearElemento("p", "", "", "", "BERRY", "#botonBerry")

    crearElemento("div", "pulsadoresConstruccionesContenedor", "pulsaConstCon2", "", "", "#seccionAldea")
    crearElemento("div", "pulsadores2", "botonRecolectar", "", "", "#pulsaConstCon2")
    crearElemento("img", "imgPulsadores", "", "./media/boton2.png", "", "#botonRecolectar")
    crearElemento("div", "noComprado", "", "", "", "#botonRecolectar")
    crearElemento("img", "bloqueado", "", "./media/bloqueado.png", "", "#botonRecolectar")
    crearElemento("p", "", "", "", "RECOLECTAR", "#botonRecolectar")
    crearElemento("img", "infoImg", "infoRecolectar", "./media/info.png", "", "#pulsaConstCon2")

    crearElemento("div", "contenedorRecursos", "recursosAldea", "", "", "#seccionAldea")
}

function maquetarBotonesSecciones() {
    crearElemento("div", "", "botonesSecciones", "", "", "body")

    crearElemento("div", "botones", "botonConstrucciones", "", "", "#botonesSecciones")
    crearElemento("img", "mainImg", "", "./media/construccion.png", "", "#botonConstrucciones")

    crearElemento("div", "botones", "botonAldea", "", "", "#botonesSecciones")
    crearElemento("img", "mainImg", "", "./media/casa.png", "", "#botonAldea")

    crearElemento("div", "botones", "botonNavegar", "", "", "#botonesSecciones")
    crearElemento("img", "mainImg", "", "./media/navegar.png", "", "#botonNavegar")
}
