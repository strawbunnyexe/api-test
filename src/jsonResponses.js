const users = {};

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
const addUser = (request, response) => {
  // default json message
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // get name and age from request body
  const { name, age } = request.body;

  // error message if name or age are missing
  if (!name || !age) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code
  let responseCode = 204;

  // create empty user if user doesn't exist yet
  if (!users[name]) {
    // change status code to 201 (created)
    responseCode = 201;
    users[name] = {
      name,
    };
  }

  // add or update fields for the user
  users[name].age = age;

  // set created message if response is created
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // send no response (empty message) if status code is 204
  return respondJSON(request, response, responseCode, {});
};

// return user object as JSON
const getUsers = (request, response) => {
  const responseJSON = {
    users,
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
  getUsers,
  addUser,
  notFound,
};
