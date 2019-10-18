const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const mainDisplay = document.querySelector('main')

loadPage()

// function removeChild(parentNode){
//     while (parentNode.firstChild) { 
//         parentNode.removeChild(parentNode.firstChild)  
//     }
// }

function loadPage(){
    fetch(TRAINERS_URL)
    .then(resp => resp.json())
    .then(respJSON => {
        respJSON.forEach(displayTrainer)
    })
}

function displayTrainer(obj){
    const pokemonList = obj.pokemons
    
    const trainerCard = document.createElement('div')
    trainerCard.className = 'card'
    trainerCard.dataset.id = obj.id
    
    const p = document.createElement('p')
    p.innerText = obj.name
    
    const addPokemon = document.createElement('button')
    addPokemon.className = 'withdraw'
    addPokemon.id = `add_pokemon_${obj.id}`
    addPokemon.innerText = 'Add Pokemon'
    
    const pokemonUL = document.createElement('ul')
    
    pokemonList.forEach(pokemon => {
        appendPokemon(pokemon, pokemonUL)
    })
    
    trainerCard.append(p, addPokemon, pokemonUL)
    
    trainerCard.addEventListener('click', evt => {
        updateTeam(obj, evt.target)
    })
    
    mainDisplay.append(trainerCard)
}

function appendPokemon(pokemon, ul){
    const pokemonName = document.createElement('li')
        pokemonName.innerText = `${pokemon.nickname} (${pokemon.species})`
        pokemonName.dataset.id = pokemon.id
        pokemonName.id = `pokemon_${pokemon.id}`
        
        const releaseBtn = document.createElement('button')
        releaseBtn.className = 'release'
        releaseBtn.dataset.id = pokemon.id
        releaseBtn.id = `release_pokemon_${pokemon.id}`
        releaseBtn.innerText = 'Release'
        
        pokemonName.append(releaseBtn)
        
        ul.append(pokemonName)
}

function updateTeam(obj, event){
    if (event.className === 'release'){
        const id = event.dataset.id
        releasePokemon(id, event, obj)
    }
    else if (event.className === 'withdraw'){
        if (obj.pokemons.length >= 6){return}

        withdrawPokemon(obj, event)
    }
}

function releasePokemon(id, event, obj){
    fetch(`${POKEMONS_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(respJSON => {
        event.parentNode.remove()
        obj.pokemons.length -= 1
    })
}

function withdrawPokemon(obj, event){
    const trainer_id = obj.id
    fetch(POKEMONS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            trainer_id: trainer_id
        })
    })
    .then(resp => resp.json())
    .then(respJSON => {
        const pokemonCard = event.parentNode
        const ul = pokemonCard.querySelector('ul')
        appendPokemon(respJSON, ul)
        obj.pokemons.length += 1
    })
}