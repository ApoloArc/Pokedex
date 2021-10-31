//Importamos los estilos

import './scss/app.scss'

//Cargar la App

document.addEventListener('DOMContentLoaded', App());


//Buscar Pokemon

//Funciones

function App() {
    paginacion();
    buscarPokemonTipo();
}


function paginacion() {
    
    
    let numero = 0;
   


    paginaAnterior(numero);

    paginaSiguiente(numero);

    
    obtenerPokemones('', numero);
   

}

function paginaAnterior(numero) {
    
    const antes = document.getElementById('antes');


    if (numero === 0) {
        antes.disabled = true;
    }
    else{
        antes.disabled = false;
    }

    buscarPokemonGeneral(numero);
    antes.addEventListener('click', () => {
             
        if (numero === 0) {
            antes.disabled = true;
        }
        else{
            antes.disabled = false;
        }
       
        buscarPokemonGeneral(numero);
        
    })

}

function paginaSiguiente(numero) {
    
    const despues = document.getElementById('despues');

    despues.addEventListener('click', () => {        

        numero = numero + 10;

        if (numero === 150) {
            antes.disabled = true;
        }
        else{
            antes.disabled = false;
        }
        
        buscarPokemonGeneral(numero);
        
    })

}



function buscarPokemonGeneral(numero) {

    const btn = document.getElementById('pokeBtn');

    const input = document.getElementById('pokeBusqueda');


    if(input.value === ''){
        obtenerPokemones(input.value, numero);      
    }
    btn.addEventListener('click', () => {
        limpiarHTML();
        obtenerPokemones(input.value, numero)
        
    });

}

async function obtenerPokemones(palabra, numero) {

    const link = `https://pokeapi.co/api/v2/pokemon?limit=25&offset=${numero}`;

    const request =
        await fetch(link)
            .then(res => res.json())
            .then(data => {
                obtenerNombresPokemon(data, palabra)
    })
    .catch(error => mostrarError())

    return request;
}


function obtenerNombresPokemon (data, palabra){
    
    const {results} = data;

    //Nombres de los pokemones

    const nombres = results.map( pokemon => {
        const {name} = pokemon;
        return name
    })

    const resultado = nombres.map( nombre  => nombre )

    const filtrado = resultado.filter( palabraFiltrada => palabraFiltrada.includes(palabra.toLowerCase()))

    

    const imprimirResultados = filtrado.map( pokemon => {

        
        const link = `https://pokeapi.co/api/v2/pokemon/${pokemon}`
        realizarFetch(link)

    })

    ordenarPokemones(nombres);

    if (filtrado.length > 0) {
        return;
    }
    else{
        mostrarError()
    }

}



function pokeCards(name, type, order, sprites) {

    const {other} = sprites;

    //Creamos el card contenedor


    const card = document.createElement('DIV');
    card.classList.add('card');
    //Seleccionamos el contenedor

    const cards = document.querySelector('.cards');


    //Creamos los elementos que tendrá el card de los pokemones

    const texto = document.createElement('p');
    texto.textContent = `${name}`;

    const orden = document.createElement('p');
    orden.textContent = `${order}`;

    const tipoPokemon = document.createElement('P');

    tipoPokemon.textContent = `${type}`

    const imagen = document.createElement('IMG');
    imagen.src = other.home.front_shiny;

    //Agregamos los elementos al card


    card.append(imagen, type, texto, orden);


    //Agregamos los elementos al resultado

    cards.append(card);

}

function limpiarHTML() {
    const cards = document.getElementById('pokeCards');
    while (cards.firstChild) {
    cards.removeChild(cards.firstChild);
    }
}

function mostrarError() {

    const text = document.createElement('p');
    text.textContent = 'No se ha encontrado ese pokemon, por favor, vuelve a buscar otro pokemón'

    const cards = document.getElementById('pokeCards');

    cards.appendChild(text)
}




//Filtrar Pokemones por el tipo 
//--tipo : Electrico--

function buscarPokemonTipo() {
    
    const inputPalabra = document.getElementById('pokeBusquedaTipo');
    const inputBtn = document.getElementById('pokeBtnTipo');

    if (inputPalabra.value === '') {
        
        limpiarHTML();

    }
    
    else{
        limpiarHTML()
    }
    inputBtn.addEventListener('click', () => {
        limpiarHTML();
        obtenerPokemonesTipo(inputPalabra.value, 0)
    })

}



async function obtenerPokemonesTipo(palabra, numero) {

    const link = `https://pokeapi.co/api/v2/pokemon?limit=25&offset=${numero}`;

    const request =
        await fetch(link)
            .then(res => res.json())
            .then(data => {
                obtenerUrlPokemon(data, palabra)
    })
    .catch(error => mostrarError())

    return request;
}

async function obtenerUrlPokemon (data, palabra){
    
    const {results} = data;

    //Nombres de los pokemones

    const nombres = results.map(x => {

        const {url} = x;

        return url;

    })
    obtenerTipos(nombres, palabra);
}


async function obtenerTipos(nombres, palabra) {

    const arregloTipos = await Promise.all(nombres.map( x => obtenerNameTipo(x)));


    const filtrados = arregloTipos.map(x => {
        const name = x.name;
        const tipo = x.tipo;


        if (tipo.includes(palabra.toLowerCase())) {
            
             
            const link = `https://pokeapi.co/api/v2/pokemon/${name}`
            realizarFetch(link)

        }

    })

}

async function obtenerNameTipo(x){

    const res = await fetch(x)
                    .then(res => res.json())
                    .then(data => {
                        const {types} = data;
                        const {type} = types [0];
                        const name = data.name;
                        const tipo = type.name;

                        const resultado = {name, tipo};
                        return resultado;
                    })
    
    return res;

}

async function realizarFetch(link) {
    limpiarHTML()
    await fetch(link)
        .then(response => response.json())
        .then( data => {

            const {order, name , sprites} = data;
            const {types} = data;
            const {type} = types [0];
            const nombre = type.name;
            pokeCards(name, nombre, order, sprites)
        } )
}


function ordenarPokemones(arrPokemones){

    const obtenerNombres = arrPokemones;

    const btnOrdenarAZ = document.getElementById('ordenarAZ');
    const btnOrdenarZA = document.getElementById('ordenarZA');
    const btnReset = document.getElementById('resetOptions');

    //Reset (Mostrar el Array desordenado)

    btnReset.addEventListener('click', ()=>{
        limpiarHTML()
        obtenerPokemonesTipo('', 0)
    })

    //Ordenar de la "A" - "Z"
    btnOrdenarAZ.addEventListener('click', () => {
        
        limpiarHTML();

        ordenarAZ(obtenerNombres)
    })

    
    //Ordenar de la "A" - "Z"
    btnOrdenarZA.addEventListener('click', () => {
        
        limpiarHTML();

        ordenarZA(obtenerNombres)
    })

}

function ordenarZA(lista) {
    
    const nombres = lista;

    nombres.sort().reverse();

    imprimirLista(nombres);

}

function ordenarAZ(lista) {
    
    const nombres = lista;

    nombres.sort();

    imprimirLista(nombres);

}

function imprimirLista(lista) {

    const nombres = lista;
    
    const palabraBuscada = nombres.map( x => {
        
        limpiarHTML();
        
        const link = `https://pokeapi.co/api/v2/pokemon/${x}`

        realizarFetch(link)

    });
    
}
