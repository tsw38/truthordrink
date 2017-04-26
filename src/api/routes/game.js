

var game = function(server,sql,path){

  server.get(/\/game(\/)?.+/, function (req, res, next){
    res.sendFile(path.resolve(__dirname,'..','..','public','index.html'));
    // res.sendFile(path.resolve(__dirname, ''))
    // console.log("USER COOKIES");
    // console.log(req.cookies);

    // const con = sql.createConnection({
    //   host:process.env.DB_HOST,
    //   user:process.env.DB_USER,
    //   password:process.env.DB_PASS,
    //   database:process.env.DB_NAME
    // });

    // con.connect(function(err){
    //   if(err){ console.error('Error connecting to DB'); return; }
    // });
    //
    // let query = sql.format("SELECT * FROM truths;");
    //
    // con.query(query, function (err, rows){
    //   if(err) console.error(err);
    //   console.log("Succesfully pulling truths");
    //   let results = [];
    //   rows.forEach(function(payload, index){
    //     let { id, message } = payload;
    //     results.push({ id,message });
    //   });
    //
    //   parseCookieInformation(req,res,results,sql,con);
    //
    // });
  });
};

// function parseCookieInformation(req,res,results,sql,con){
//   if(req.cookies.dHJ1dGhvcmRyaW5rdXNlcg){ // user has been on here before,read the cookie data
//     res.send('HELLO');
//   } else { // user has not been on here before, set cookie
//     //
//     // let insertQuery = sql.format('INSERT INTO users(UUID) VALUES(?)',[id]);
//     // con.query(insertQuery, (err,resp)=>{
//     //   if(err){
//     //     console.error(err);
//     //   } else {
//     //     console.log("Inserted New User");
//     //   }
//     // });
//     let random = Math.floor((Math.random() * results.length) + 0);
//     res.send(JSON.stringify(results[random]));
//   }
//   con.end(function(err){
//     if(err){ console.error(err); }
//   });
// }

module.exports = game;
