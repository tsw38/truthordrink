module.exports = (app,sql,path) => {
  app.get('/api/get-unanswered-questions(\/)?', function (req, res, next){
    const con = sql.createConnection({
      host:process.env.DB_HOST,
      user:process.env.DB_USER,
      password:process.env.DB_PASS,
      database:process.env.DB_NAME
    });

    let formatted = sql.format(``+
      `SELECT * ` +
      `FROM truths ` +
      `WHERE truths.id NOT IN (`+
        `SELECT truths.id ` +
        `FROM truths ` +
        `INNER JOIN responses ON truths.id = responses.truthID ` +
        `WHERE ? IN (UUID_1, UUID_2) AND ` +
        `? IN (UUID_1, UUID_2) ` +
      `);`, [req.query.p1, req.query.p2]
    );

    con.connect((err)=>{
      if(err){ console.error('Error connecting to DB'); return; }
    });

    con.query(formatted, (err,rows)=>{
      if(err) console.error(err);
      let results = [];

      rows.forEach((payload,index)=>{
        results.push({id:payload.id,message:payload.message});
      });

      res.send(JSON.stringify(results));
    });

  });
}
