import UserStore from '../STORES/UserStore.js';

class UserActions {
  updateActiveUsers(payload){ UserStore.activeUsers = payload; }
  deleteUser(uuid){ delete UserStore.activeUsers[uuid]; }
  askToJoinRoom(myRoom,requestedRoom){
    UserStore.socket.emit('room',[myRoom, requestedRoom]);
    console.log("||||||||||||||||||||||||||||||||||||")
    console.log("          REQUEST TO JOIN           ");
    console.log(requestedRoom);
    console.log("||||||||||||||||||||||||||||||||||||")
  }
}

let actions = window.actions = new UserActions;
export default actions;
