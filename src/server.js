const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// recompiles the body of a request and calls appropiate handler
const parseBody = (request, response, handler) => {
  const body = [];

  // bad request error
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // get a piece of the body and push to array
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // turn body into string, and parse into object for bodyParams
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);

    // call handler funtion using request
    handler(request, response);
  });
};

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addPokemon') { // add pokemon
    parseBody(request, response, jsonHandler.addPokemon);
  } else if (parsedUrl.pathname === '/ratePokemon') { // rate pokemon
    parseBody(request, response, jsonHandler.ratePokemon);
  }
};

// handle GET requests
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/') { // index html
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/docs') { // docs page
    htmlHandler.getDocs(request, response);
  } else if (parsedUrl.pathname === '/style.css') { // style css
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getPokemon') { // get pokemon
    jsonHandler.getPokemon(request, response);
  } else if (parsedUrl.pathname === '/getPokemonType') { // get pokemon type
    jsonHandler.getPokemonType(request, response);
  } else if (parsedUrl.pathname === '/getPokemonEvolution') { // get pokemon evolution
    jsonHandler.getPokemonEvolution(request, response);
  } else if (parsedUrl.pathname === '/getAllPokemon') { // get all pokemon
    jsonHandler.getAllPokemon(request, response);
  } else { // not found page
    jsonHandler.notFound(request, response);
  }
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  request.query = Object.fromEntries(parsedUrl.searchParams);

  // check request method
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
