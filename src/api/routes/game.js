module.exports = (app,sql,path) =>{
  module.unanswered = require('./getUnansweredQuestions')(app,sql,path);
  module.playersResponded = require('./submitTruthResponses')(app,sql,path);

  return module;
}
