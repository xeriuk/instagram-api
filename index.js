import UserService from './src/Service/UserService';
import StoryService from './src/Service/StoryService';
import { PORT } from './config'

const express = require('express');
const app = express();
app.disable('etag');

app.get('/', (req, res) => {
  res.json({
    'endpoints': [
      "api/users/{username}",
      "api/users/{username}/stories",
    ]
  });
});

app.get('/api/users/:username', (req, res) => {
  const username = req.params.username;
  UserService.getUser(username).then((user => {
    res.json(user);
  })).catch(error => {
    res.status(error.status).json(error);
  });
});

app.get('/api/users/:username/stories', (req, res) => {
  const username = req.params.username;
  UserService.getUser(username).then((user => {
    if (user.isPrivate) {
      res.status(401).json({
        message: 'This account is private!',
        status: 401,
      });
    } else {
      StoryService.getStories(user.id).then(stories => {
        res.json(stories);
      }).catch(error => {
        res.status(error.status).json(error);
      });
    }
  })).catch(error => {
    res.status(error.status).json(error);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

