const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port, () => console.log(`hot-potate listening on port ${port}`))

const game = {
  users: {},
  it: null,
  countdown: 10,
  loser: null
};

setInterval(() => {
  const now = Date.now();

  game.countdown--;
  if (game.countdown <= 0) {
    game.countdown = 10;
    game.loser = game.it;
  } else if (game.countdown === 6) {
    game.loser = null;
  }

  Object.keys(game.users).forEach(username => {
    if (now - game.users[username] > 5000) {
      delete game.users[username];
      if (game.it === username) {
        game.it = null;
      }
    }
  });

  if (!game.it) {
    game.it = Object.keys(game.users)[0];
  }
}, 1000);

app.post('/api/game', (req, res) => {
  if (!req.body.username) {
    return res.status(400).send();
  }

  game.users[req.body.username] = Date.now();
  return res.status(201).send();
});

app.get('/api/game', (req, res) => {
  res.json(game);
});

app.put('/api/game/it', (req, res) => {
  if (!req.body.username) {
    return res.status(400).send();
  }

  game.it = req.body.username;
  return res.status(200).send();
});
