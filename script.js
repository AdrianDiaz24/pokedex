document.getElementById('searchBtn').addEventListener('click', getPokemon);
document.getElementById('pokemonName').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') getPokemon();
});

async function getPokemon() {
    const name = document.getElementById('pokemonName').value.toLowerCase().trim();
    const info = document.getElementById('pokemonInfo');
    const errorMsg = document.getElementById('errorMsg');

    if (!name) {
        errorMsg.textContent = "Por favor, ingresa un nombre o ID.";
        info.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) throw new Error("Pokémon no encontrado");

        const data = await response.json();

        document.getElementById('pokemonImage').src = data.sprites.front_default;
        document.getElementById('pokemonTitle').textContent = data.name.toUpperCase();
        document.getElementById('pokemonHeight').textContent = data.height / 10 + " m";
        document.getElementById('pokemonWeight').textContent = data.weight / 10 + " kg";

        info.style.display = "block";
        errorMsg.textContent = "";
    } catch (error) {
        info.style.display = "none";
        errorMsg.textContent = "❌ Pokémon no encontrado. Intenta de nuevo.";
    }
}
