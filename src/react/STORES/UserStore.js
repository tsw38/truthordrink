import { autorun, observable } from 'mobx';
//autorun is only for debugging generally
class UserStore {
  @observable activeUsers = {};
}

var store = window.userStore = new UserStore

export default store


autorun(()=>{
  // console.log(store.filter);
  // console.log(store.truths[0]);
})
