const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .populate('owner')
    .then((cardData) => {
      if (cardData.owner._id.toString() !== req.user._id) {
        return Promise.reject(new Error('Нельзя удалить чужую карточку!'));
      }
      return cardData;
    })
    .then(() => {
      Card.findByIdAndRemove(req.params.cardId)
        .then((card) => res.status(200).send({ data: card }))
        .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` }));
    })
    .catch((err) => {
      if (err.message.includes('of null')) {
        res.status(404).send({ message: 'Card not found' });
      }
      if (err.name === 'Error') {
        res.status(403).send({ message: err.message });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(201).send({ data: card });
      } else res.status(404).send({ message: 'Card not found' });
    })
    .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else res.status(404).send({ message: 'Card not found' });
    })
    .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
