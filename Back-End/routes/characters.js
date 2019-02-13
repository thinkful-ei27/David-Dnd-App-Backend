const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Character = require('../models/character');
const router = express.Router();
const jsonParser = bodyParser.json();

function wait(time) {return new Promise(resolve => setTimeout(resolve, time));}
// router.use((req, res, next) => setTimeout(next, 3000));

router.get('/', jsonParser, (req, res, next) => {
  
  const userId = req.user.id; 

  Character.find({userId})
  .then(results => {
    res.json(results);
  })
  .catch(err => {
    next(err)
  })

})

router.get('/:id', (req, res, next) => {
  const  {id}  = req.params;
  const userId = req.user.id;
  console.log("ID IS:******  ", id)
  Character.findById(id)
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
 let UID;
const { name, characterClass, race, level, Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma, userId} = req.body;
if (req.user.id) {
  UID = req.user.id;
} else {
  UID = userId;
}
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
  userId: UID 
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

router.put('/:id', jsonParser, (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  console.log("req body is: ", req.body)

  const toUpdate = {};
  const updateableFields = ["characterClass", "race", "level", "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  return Character.findByIdAndUpdate(id, toUpdate, { new: true })
  .then(result => {
    console.log("New Result SHOULD BE:", result)
    return res.json(result);
  })
  .catch(err => {
    next(err);
  });


})

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  console.log("id is: ", id)
  const userId = req.user.id
  Character.findByIdAndDelete(id)
  .then(() => {
    res.sendStatus(204);
  })
  .catch(err => {
    next(err);
  })
})

module.exports = router;