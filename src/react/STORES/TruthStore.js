import { autorun, observable } from 'mobx';
//autorun is only for debugging generally
class TruthStore {
  @observable truths = [];
}

var store = window.store = new TruthStore

export default store


autorun(()=>{
  // console.log(store.filter);
  // console.log(store.truths[0]);
})
