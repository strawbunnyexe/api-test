const fs = require('fs');

const pokedex = fs.readFileSync(`${__dirname}/../data/pokedex.json`);
const pokedexJson = JSON.parse(pokedex);

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // only write json content if not HEAD request or 204 status code
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

// helper function to go through json data and see if pokemon currently exist
const pokemonExist = (pokemonName) => {
  for (let i = 0; i < pokedexJson.length; i++) {
    if (pokedexJson[i].name === pokemonName) {
      return true;
    }
  }
  return false;
};

// add a user from a POST body
const addPokemon = (request, response) => {
  // default json message
  const responseJSON = {
    message: 'Name is required.',
  };

  // get name from request body
  const { name, type } = request.body;

  // error message if name is missing
  if (!name || !type) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code
  let responseCode = 204;

  // create empty pokemon if user doesn't exist yet
  if (!pokemonExist(name)) {
    // change status code to 201 (created)
    responseCode = 201;
    pokedexJson.push({ name, type: [type] });
  }

  // set created message if response is created
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    responseJSON.pokemon = pokedexJson;
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // send no response (empty message) if status code is 204
  return respondJSON(request, response, responseCode, {});
};

const ratePokemon = (request, response) => {
  // default json message
  const responseJSON = {
    message: 'Name and rating are required.',
  };
  // get name from request body
  const { name, rate } = request.body;

  // error message if name or age are missing
  if (!name || !rate) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // find pokemon that matches name and assign rating
  for (let i = 0; i < pokedexJson.length; i++) {
    if (pokedexJson[i].name === name) {
      pokedexJson[i].rating = rate;
      return respondJSON(request, response, 204, responseJSON);
    }
  }

  return respondJSON(request, response, 404, { id: 'notFound', message: 'Pokemon not found' });
};

// return pokemon based on name or id
const getPokemon = (request, response) => {
  const pokemons = [];
  const pokemonName = request.query.name;
  const responseJSON = {
    message: 'Name is required',
  };

  // error if pokemon name is not given
  if (!pokemonName) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // find pokemon that matches name
  pokedexJson.forEach((pokemon) => {
    if (pokemon.name === pokemonName) {
      pokemons.push(pokemon);
    }
  });

  // handle response if pokemon isn't found
  if (pokemons.length === 0) {
    responseJSON.message = 'Pokemon Not Found';
    responseJSON.id = 'notFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  // pokemon successfully found
  responseJSON.message = 'Pokemon Found Successfully';
  responseJSON.pokemons = pokemons;

  return respondJSON(request, response, 200, responseJSON);
};

const getPokemonType = (request, response) => {
  const pokemons = [];
  const pokemonType = request.query.type;

  // search for matching pokemons with given type
  pokedexJson.forEach((pokemon) => {
    if (pokemon.type.includes(pokemonType)) {
      pokemons.push(pokemon);
    }
  });

  const responseJSON = {
    pokemons,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getPokemonEvolution = (request, response) => {
  const pokemons = [];

  const pokemonName = request.query.name;
  const responseJSON = {
    message: 'Name is required',
  };

  // error if pokemon name is not given
  if (!pokemonName) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // find matching pokemon and get evolutions
  pokedexJson.forEach((pokemon) => {
    if (pokemon.name === pokemonName) {
      pokemons.push(pokemon.next_evolution);
    }
  });

  responseJSON.message = 'Found successfully';
  responseJSON.pokemons = pokemons;

  return respondJSON(request, response, 200, responseJSON);
};

// get all pokemon in JSON file
const getAllPokemon = (request, response) => {
  const responseJSON = {
    pokedexJson,
  };

  respondJSON(request, response, 200, responseJSON);
};

// not found response
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getPokemon,
  getPokemonType,
  getPokemonEvolution,
  getAllPokemon,
  addPokemon,
  ratePokemon,
  notFound,
};
