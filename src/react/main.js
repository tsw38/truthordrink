import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MainIcon from './Components/MainIcon';
import CardWrapper from './Components/CardWrapper';
import TruthStore from './STORES/TruthStore.js';


const DOC_ROOT = document.getElementById('app');

class App extends Component{
  constructor(){
    super();
    this.socket = this.socket.bind(this);
  }

  componentDidMount(){
    this.socket();
  }

  socket(){
    // let socket = io.connect(`//${window.location.hostname}:6357`);
    //
    // socket.on('news', function(data){
    //   console.log('news',data);
    // });
    //
    // socket.on('private',function(data){
    //   console.log("PRIVATE:",data);
    //   socket.emit('private',{msg:'TANKS'}); //message to private room
    // });
  }

  render() {
    return(
      <div className="content-wrapper">
        <MainIcon />
        <CardWrapper store={TruthStore}/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, DOC_ROOT);
