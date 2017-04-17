import UserStore from '../STORES/UserStore.js';

class UserActions {
  updateActiveUsers(payload){
    UserStore.activeUsers = payload;
  }
  deleteUser(uuid){
    delete UserStore.activeUsers[uuid];
  }
}

let actions = new UserActions;
export default actions;
