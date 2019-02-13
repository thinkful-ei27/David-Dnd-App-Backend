'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config')

const {app} = require('../server');
const Character = require('../models/character')
const User = require('../models/user')
const { characters, users } = require('../db/data');
const { TEST_MONGODB_URI } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;
describe('DnD Character Creator API - characters', function() {
  let user
  let token;
  let characterId;
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true, useCreateIndex : true })
      .then(() => Promise.all([
        Character.deleteMany()
      ]))
  });

  beforeEach(function () {
      user = users;
      token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
    }
  );

  after(function () {
    return mongoose.disconnect();
  });

  describe('POST /api/characters', function() {
    it('should return created character', function() {
      
      const character = {
      "name": "Test Character three",
      "characterClass" : "bard",
      "race": "elf",
      "level": "1",
      "Strength": "10",
      "Dexterity": "10",
      "Constitution": "10",
      "Intelligence": "10",
      "Wisdom": "10",
      "Charisma": "10",
      "userId": "5c644be63ad65a181caa27f2"
      }
      return chai.request(app)
      .post('/api/characters')
      .set('Authorization', `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send(JSON.stringify(character))
      .then((res => {
        characterId = res.body.id;
        expect(res).have.status(201);
        expect(res.body).to.be.a('object')
        expect(res.body).to.include.all.keys('name', 'characterClass', 'race', 'level', 'Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma', 'userId', 'id');
      }))
    })
    
  })

  describe('GET /api/characters', function() {
    it('should return an array of characters', function() {
      return chai.request(app)
      .get('/api/characters')
      .set('Authorization', `Bearer ${token}`)
      .then((res => {
        expect(res).have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an.a('array')
      }))
    })
  })

  describe('PUT /api/characters', function() {
    it('should return edited character', function() {
      const character = {
      "level": "12",
      "Strength": "12",
      "Dexterity": "12",
      "Constitution": "",
      "Intelligence": "12",
      "Wisdom": "12",
      "Charisma": "12",
      }
      return chai.request(app)
      .put(`/api/characters/${characterId}`)
      .set('Authorization', `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send(JSON.stringify(character))
      .then((res => {
        expect(res).have.status(200);
        expect(res.body).to.be.a('object')
        expect(res.body).to.include.all.keys('name', 'characterClass', 'race', 'level', 'Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma', 'userId', 'id');
        expect(res.body.level).to.equal(12);
      }))
    })
  })

  describe('DELETE /api/characters', function() {
    it('should delete the character', function() {
      return chai.request(app)
      .delete(`/api/characters/${characterId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((res => {
        expect(res).have.status(204);
      }))
    })
  })
  
})


