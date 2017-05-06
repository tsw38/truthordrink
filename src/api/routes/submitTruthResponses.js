module.exports = (app,sql,path) => {
  app.post('/api/submit-truth-response(\/)?', function (req, res, next){
    let payload = req.body;
    let safeguard = ()=> {
      if("players" in payload){
        if("qID" in payload){
          if("responses" in payload){
            var responses = payload.responses;
            if(payload.players[0].length && payload.players[1].length && payload.players.legnth === 2){
              if(typeof payload.qID === 'number'){
                if(responses.length === 2 && (responses[0] === 1 || responses[0] === 0) && (responses[1] === 1 || responses[1] === 0)){
                  return true;
                } else { return false; } // submitted a false response
              } else { return false; } // submitted a false qID
            } else { return false; } // submitted an incorrect players array
          } else { return false; } // responses key isnt present
        } else { return false; } // qID key isnt present
      } else { return false; } // players key isnt present
    };

    if(!safeguard){
      res.sendStatus(500);
    } else {
      const con = sql.createConnection({
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASS,
        database:process.env.DB_NAME
      });
      let massaged = req.body;
      massaged.responses = massaged.responses.join("");

      let formatted = sql.format(``+
        `INSERT INTO responses (truthID,answer,UUID_1,UUID_2) ` +
        `VALUES(?,?,?,?);`,
        [massaged.qID,massaged.responses,massaged.players[1],massaged.players[0]]
      );

      con.connect((err)=>{
        if(err){ console.error('Error connecting to DB'); return; }
      });

      con.query(formatted, (err,rows)=>{
        if(err) console.error(err);
        res.sendStatus(200);
      });
    }
  });
}
