const fs = require('fs');

const pokedex = fs.readFileSync(`${__dirname}/../data/pokedex.json`);

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

// add a user from a POST body
const addPokemon = (request, response) => {
  // default json message
  const responseJSON = {
    message: 'Name is required.',
  };

  // get name from request body
  const name = request.body;

  // error message if name or age are missing
  if (!name) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code
  let responseCode = 204;

  // create empty pokemon if user doesn't exist yet
  if (!pokedex[name]) {
    // change status code to 201 (created)
    responseCode = 201;
    pokedex[name] = {
      name,
    };
  }

  // set created message if response is created
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
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
  const name = request.body;

  // error message if name or age are missing
  if (!name) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code
  let responseCode = 204;

  // create empty pokemon if user doesn't exist yet
  if (!pokedex[name]) {
    // change status code to 201 (created)
    responseCode = 201;
    pokedex[name] = {
      name,
    };
  }

  // set created message if response is created
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // send no response (empty message) if status code is 204
  return respondJSON(request, response, responseCode, {});
};

// return pokemon based on name or id
const getPokemon = (request, response) => {
  const pokedexJson = JSON.parse(pokedex);
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
  const pokedexJson = JSON.parse(pokedex);
  const pokemons = [];
  const pokemonType = request.query.type;

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
  const pokedexJson = JSON.parse(pokedex);

  const pokemonName = request.query.name;

  pokedexJson.forEach((pokemon) => {
    if (pokemon.name === pokemonName) {
      pokemons.push(pokemon.next_evolution);
    }
  });

  const responseJSON = {
    pokemons,
  };

  respondJSON(request, response, 200, responseJSON);
};

// get all pokemon in JSON file
const getAllPokemon = (request, response) => {
  const pokemons = JSON.parse(pokedex);
  const responseJSON = {
    pokemons,
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
