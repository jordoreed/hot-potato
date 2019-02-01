<template>
  <div class="app">
    <div v-if="loading">loading...</div>
    <div v-else class="users">
      <div class="user" v-for="username in usernames" :key="username">
        <img :src="`https://github.com/${username}.png`" @click="pass(username)" />
        <div>{{ username }}</div>
        <img v-if="gameState.it === username" src="https://media.giphy.com/media/3o7bu4EJkrXG9Bvs9G/giphy.gif" />
        <h1 v-if="gameState.it === username">{{ gameState.countdown }}</h1>
      </div>
    </div>

    <h1 class="loser" v-if="gameState && gameState.loser">LOSER: {{ gameState.loser }}</h1>
  </div>
</template>

<script>
import axios from 'axios';

const SERVER_URL = 'http://10.10.30.83:3000';
const ME = 'jordoreed';
const usernameParam = new URLSearchParams(document.location.search).get('username');

export default {
  name: 'app',

  data() {
    return {
      me: usernameParam || ME,
      loading: true,
      gameState: null,
      usernames: []
    };
  },

  created() {
    this.load();
  },

  methods: {
    load() {
      console.log('loading app');

      return this.checkin()
        .then(this.getGameState)
        .then(() => {
          setInterval(this.update, 200);
          this.loading = false;
        })
        .catch(error => {
          console.log('error', error);
        });
    },

    checkin() {
      return axios.post(`${SERVER_URL}/api/game`, { username: this.me });
    },

    getGameState() {
      console.log('getting game state');
      return axios.get(`${SERVER_URL}/api/game`).then(response => {
        this.gameState = response.data;
        this.usernames = Object.keys(this.gameState.users).sort();
        console.log('gamestate', this.gameState);
      });
    },

    update() {
      console.log('updating');
      return this.checkin()
        .then(this.getGameState);
    },

    pass(username) {
      console.log('attempting to pass to', username);
      if (this.gameState.it !== this.me) {
        console.log('you are not it!');
        return;
      }

      return axios.put(`${SERVER_URL}/api/game/it`, { username });
    }
  }
}
</script>

<style scoped>
.app {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.users {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.user {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.user img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0 3px 5px 0 rgba(0,0,0,0.5);
}

.user img:hover {
  box-shadow: 0 5px 5px 0 rgba(0,0,0,0.5);
  cursor: pointer;
}

.user div {
  padding-top: 5px;
}

.loser {
  color: red;
	animation: flash linear 1s infinite;
}

@keyframes flash {
	0% {
    opacity: 1;
    font-size: 100%;
  }
	50% {
    opacity: .1;
    font-size: 300%;
  }
	100% {
    opacity: 1;
    font-size: 100%;
  }
}
</style>
