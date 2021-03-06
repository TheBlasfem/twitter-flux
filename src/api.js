import actions from './actions';
import dispatcher from './dispatcher';
import constants from './constants';

function get(url){
  return fetch(url,{
    credentials: 'same-origin'
  }).then((res)=>{
    return res.json();
  });
}

function post(url, body){
  return fetch(url,{
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(body || {}),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }).then((res)=>{
    return res.json();
  });
}

const API = {
  fetchTweets(){
    get('/api/tweets').then(actions.gotTweets.bind(actions));
  },
  fetchUsers(){
    get('/api/users').then(actions.gotUsers.bind(actions));
  },
  saveTweet(text){
    text = text.trim();
    if (text === "") return;
    post('/api/tweets', {text: text}).then(actions.tweeted.bind(actions));
  },
  follow(id){
    post('/api/follow/' + id).then(actions.followed.bind(actions));
  },
  unfollow(id){
    post('/api/unfollow/' + id).then(actions.unfollowed.bind(actions));
  }
};

dispatcher.register((action)=>{
  switch (action.actionType){
    case constants.TWEET:
      API.saveTweet(action.data);
      break;

    case constants.FOLLOW:
      API.follow(action.data);
      break;

    case constants.UNFOLLOW:
      API.unfollow(action.data);
      break;
  }
});

export default API;