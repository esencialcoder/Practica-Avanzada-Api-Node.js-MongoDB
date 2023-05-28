const requester = require('supertest');
const request = requester('http://localhost:3000');

request.get('/').expect(200, function(err){
  console.log(err);
});

request.get('/').expect('heya', function(err){
  console.log(err);
});