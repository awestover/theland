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
