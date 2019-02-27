const express = require('express'); // import the express package
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //Token 1. import it


const UsersDB = require('./usersHelpers.js');


const server = express(); // creates the server / creates an express application using the express module


// Token - defined the secret
const secret = process.env.JWT_SECRET || 'this really should not be in the server code!'; // place in .env file (can be anything)


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
function generateToken(user) {
    const payload = {
        subject: user.id, //sub in payload is what the token is about        
    };
    
    const options = {
        expiresIn: '1d',
    };

    return jwt.sign(payload, secret, options);
};


server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    UsersDB.findBy({ username })
        .first()
        .then(user => {
            // check that passwords match
            if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user); // Token - generate new token
            res.status(200).json({ message: `Welcome ${user.username}, have a token!`, token }); // Token - return new token. remove secret and roles - for test (authorization demo)
            } else {
            res.status(401).json({ message: 'Invalid Credentials. YOU SHALL NOT PASS!' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


function restricted(req, res, next) {
    const token = req.headers.authorization;
  
    if(token) {
      // is it valid?
      jwt.verify(token, secret, err => {
        if (err) {
          res.status(401).json({ you: "Can't touch this" , err});
        } else {
          next();
        }
      });
    } else {
      res.status(401).json({ you: 'shall not pass'});
    }
  }


server.get('/api/users', restricted, async (req, res) => {
    try {
      const users = await UsersDB.find();
  
      res.json(users);
    } catch (error) {
      res.send(error);
    }
});












// export default server; ES2015 Modules
module.exports = server;