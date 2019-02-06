const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Character = require('../models/character');
const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', (req, res, next) => {
  const userId = req.user.id;
  Character.find({userId})
  .then(results => {
    console.log(results)
    res.json(results);
  })
  .catch(err => {
    next(err)
  })

})

router.get('/:name', (req, res, next) => {
  const { name } = req.params;
  const userId = req.user.id;

  Character.findOne({ name, userId})
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', jsonParser, (req, res, next) => {
  console.log("Post made it")
 console.log(`This is req.user`, req.user )
 console.log("Body is: ", req.body)
const { name, characterClass, race, level, Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma} = req.body;
const insertObject = {
  name,
  characterClass,
  race,
  level,
  Strength,
  Dexterity,
  Constitution,
  Intelligence,
  Wisdom,
  Charisma,
  userId: req.user.id
}
console.log(insertObject)

return Character.create(insertObject)
.then(result => {
  return res.status(201).json(result);
  })
  .catch(err => {
    next(err);
  });
});

router.put('/:name', jsonParser, (req, res, next) => {
  const { name } = req.params;
  const userId = req.user.id;
  console.log("Post made it")
  const toUpdate = {};
  const updateableFields = ["characterClass", "race", "level", "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }

return Character.findOneAndUpdate({name, userId}, toUpdate, { new: true })
.then(result => {
  console.log(result)
  return res.status(201).json(result);
  })
  .catch(err => {
    next(err);
  });
});


})

router.delete('/:name', (req, res, next) => {
  const { name } = req.params;
  const userId = req.user.id
  Character.findOneAndDelete({name, userId})
  .then(() => {
    res.sendStatus(204);
  })
  .catch(err => {
    next(err);
  })
})

module.exports = router;