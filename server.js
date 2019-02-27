const express = require('express'); // import the express package
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //Token 1. import it


const UsersDB = require('./usersHelpers.js');

// Token - defined the secret
const secret = process.env.JWT_SECRET || 'this really should not be in the server code!'; // place in .env file (can be anything)


const server = express(); // creates the server / creates an express application using the express module

server.use(helmet());
server.use(express.json());
server.use(cors());


server.get('/', async (req, res) => {
    res.send(`
      <h1>SANITY CHECK!</h1>
    `);
});


server.post('/api/register', (req, res) => {

    const user = req.body;

    //generate hash from password
    const hash = bcrypt.hashSync(user.password, 10); // 2^n (rehashes)
    //override user.password with generated hash
    user.password = hash;

    UsersDB.add (user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

// Token - add this function to generate 















// export default server; ES2015 Modules
module.exports = server;