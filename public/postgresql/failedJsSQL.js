function queryDb(qu, callback, params)
{
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  client.connect()
    .then(() => reallyQueryDb(client, qu, callback, params))
    .catch(e => console.error('connection error', e))
}

async function reallyQueryDb(client, qu, callback, params)
{
  console.log("Querying " + qu);
  var results = [];
  await client.query(qu, (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      var cRow = JSON.stringify(row);
      console.log(cRow);
      results.push(cRow);
    }
    client.end();
  });
  queryResultRecent = results;
  callback(queryResultRecent, params);
}

function safer(s)
{
  if (!s)
  {
    return "";
  }
  if (s.length==0)
  {
    return "";
  }
  return s.replace(";", "").replace('"', '').replace("'", '').replace("-", '');
}

function formInsert(vals)
{
  var qu = "INSERT INTO users VALUES(";
  for (var i = 0; i < vals.length; i++)
  {
    try {
      if (typeof(vals[i]) == "number")
      {
        qu += vals[i];
      }
      else {
        qu += "'" + safer(vals[i]) + "'";
      }
    }
    catch (e) {
      qu += vals[i]+"";
    }
    if (i!= vals.length-1)
    {
      qu += ', ';
    }
    else {
      qu += ");";
    }
  }
  return qu;
}


JSON.stringify(row);

function handleSelectDb()
{
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  client.connect();

  console.log("Querying " + unm);
  var results = [];
  client.query("SELECT * FROM users WHERE name=$1;", [unm], (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      var cRow = row;
      console.log(cRow);
      results.push(cRow);
    }
    client.end();
    socket.emit("selectedData", results);
  });
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
client.connect();

console.log("Querying in register " + unm);
var results = [];
client.query("SELECT * FROM users WHERE name=$1;", [unm], (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    var cRow = row;
    results.push(cRow);
  }
  client.end();
  console.log(results);
  if (results.length != 0)
  {
    resp.redirect("register.html?fail=unm_exists");
  }
  else {
    queryDb("INSERT INTO Users VALUES ("+nums(fields.length)+");", fields);
    resp.redirect("index.html");
  }
});

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
client.connect();

console.log("Querying " + unm);
let results = [];
client.query("SELECT * FROM users WHERE name=$1;", [unm], (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    let cRow = row;
    console.log(cRow);
    results.push(cRow);
  }
  client.end();

  let qRes = {"pwd": ""}
  try {
    if (results  && results[0] && results[0]['pwd'])
    {
      console.log(results[0]['pwd']);
      qRes = results[0];
    }
  } catch(e)
  {
    results = [];
  }

  if (qRes['pwd'] == pwd)
  {
    pwdGood = true;
  }
  let verified = "no";
  if (pwdGood)
  {
    console.log("legit user");
    verified = "yes";
  }
  resp.redirect("game.html?"+joinIns([unm, world, anType, soundWanted, verified], ["unm", "world", "anType","soundWanted", "verified"]));
});
