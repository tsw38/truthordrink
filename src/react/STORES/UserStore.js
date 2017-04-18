import { autorun, observable } from 'mobx';
import cookie from 'react-cookie';
//autorun is only for debugging generally
class UserStore {
  @observable activeUsers = {};
  @observable me = '';
  @observable leader = '';
  @observable socket = io.connect(`//${window.location.hostname}:6357`);

  constructor(){
    this.activeUsers = this.activeUsers;
    this.socket = this.socket;
    this.me = this.me;
    this.leader = this.leader;

    console.log('what');
    let disappear = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');
    disappear = (typeof disappear !== 'undefined') ? disappear.split("=") : -1;
    console.log('what2')
    console.log(disappear);
    if(disappear !== -1){
      delete this.activeUsers[disappear[0]];
      delete this.activeUsers[disappear[1]];
    }

    console.log("HELLO FROM THE OTHER SIDE");
  }
}

let userStore = window.userStore = new UserStore
export default userStore


autorun(()=>{
  // console.log(store.filter);
  // console.log(store.truths[0]);
})
