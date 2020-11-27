var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:12345@localhost:5432/myvgym';

// var connectionString = 'postgres://cennduoixlsclu:981bdd6e18cd1acd982873624470b8fffb6218ebd21c060a774dcc7bcff02380@'+
'ec2-35-168-77-215.compute-1.amazonaws.com:5432/davqvjlbqgbfth';
const db = pgp(connectionString);

module.exports= {
  db:db
}