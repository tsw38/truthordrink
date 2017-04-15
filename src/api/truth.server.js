// @flow
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import path from 'path';

const PORT = 6357;
const app = express();

app.use(express.static(__dirname + './../public'));
app.use(morgan('dev'));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.listen(PORT, ()=>{
  console.log(`server is listening on port ${PORT}`);
});
