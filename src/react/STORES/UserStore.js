import { autorun, observable, action } from 'mobx';
import cookie from 'react-cookie';
//autorun is only for debugging generally
class UserStore {
  @observable activeUsers = observable.map();
  @observable me = '';
  @observable leader = '';
  @observable socket = io.connect(`//${window.location.hostname}:6357`);

  @action
  updateActiveUsers(actives){
    // console.log("I NED TO UPDATE THINGS");
    // console.log(actives);
    // this.activeUsers = actives;
  }

  @action
  deleteUser(uuid){
    delete this.activeUsers[uuid];
  }



  constructor(){
    this.activeUsers = this.activeUsers;
    this.socket = this.socket;
    this.me = this.me;
    this.leader = this.leader;

    this.deleteUser = this.deleteUser.bind(this);
    this.updateActiveUsers = this.updateActiveUsers.bind(this);
    // this.updateUsers = this.updateUsers.bind(this)
  }
}

let userStore = window.userStore = new UserStore
export default userStore


autorun(()=>{
  // console.log(store.filter);
  // console.log(store.truths[0]);
})
