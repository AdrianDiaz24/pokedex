document.addEventListener('DOMContentLoaded', loadAllPokemon);

const searchInput = document.getElementById('pokemonName');
const searchResults = document.getElementById('searchResults');
const pokemonInfo = document.getElementById('pokemonInfo');
const errorMsg = document.getElementById('errorMsg');
const searchContainer = document.querySelector('.search-container');
const backBtn = document.getElementById('backBtn');

let allPokemon = [];

async function loadAllPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1302');
        if (!response.ok) throw new Error("No se pudo cargar la lista de Pokémon");
        const data = await response.json();
        allPokemon = data.results;
    } catch (error) {
        errorMsg.textContent = "Error al cargar datos. Refresca la página.";
    }
}

searchInput.addEventListener('input', handleSearchInput);
searchResults.addEventListener('click', handleResultClick);
backBtn.addEventListener('click', goBackToSearch);

function handleSearchInput(e) {
    const query = e.target.value.toLowerCase().trim();
    searchResults.innerHTML = '';

    if (query.length === 0) {
        searchResults.style.display = 'none';
        return;
    }

    const filteredPokemon = allPokemon
        .filter(pokemon => pokemon.name.startsWith(query))
        .slice(0, 10); 

    if (filteredPokemon.length === 0) {
        searchResults.style.display = 'none';
        return;
    }

    filteredPokemon.forEach(pokemon => {
        const li = document.createElement('li');
        li.textContent = pokemon.name;
        li.dataset.name = pokemon.name;
        searchResults.appendChild(li);
    });

    searchResults.style.display = 'block';
}

function handleResultClick(e) {
    if (e.target && e.target.tagName === 'LI') {
        const name = e.target.dataset.name;
        getPokemonDetails(name);
        
        searchResults.style.display = 'none';
        searchInput.value = '';
        searchContainer.style.display = 'none';
    }
}

async function getPokemonDetails(name) {
    if (!name) {
        errorMsg.textContent = "Por favor, ingresa un nombre.";
        pokemonInfo.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) throw new Error("Pokémon no encontrado");

        const data = await response.json();

        document.getElementById('pokemonImage').src = data.sprites.front_default || '';
        document.getElementById('pokemonTitle').textContent = data.name.toUpperCase();
        document.getElementById('pokemonHeight').textContent = (data.height / 10) + " m";
        document.getElementById('pokemonWeight').textContent = (data.weight / 10) + " kg";

        pokemonInfo.style.display = "block";
        errorMsg.textContent = "";

    } catch (error) {
        pokemonInfo.style.display = "none";
        searchContainer.style.display = 'block';
        errorMsg.textContent = "❌ Pokémon no encontrado. Intenta de nuevo.";
    }
}

function goBackToSearch() {
    pokemonInfo.style.display = 'none';
    searchContainer.style.display = 'block';
    errorMsg.textContent = '';
    searchInput.value = '';
}
