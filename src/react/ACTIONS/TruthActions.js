import axios from 'axios';

class TruthActions {
  getOneTruth(){
    axios.get('/api/get-truth')
      .then((response)=> {
        console.log(response);
      })
      .catch((err) => {
        console.error(error.message);
      });
  }
  ensureWorking(){
    console.log("THIS STORE IS WORKING");
  }
}


let actions = new TruthActions
export default actions
