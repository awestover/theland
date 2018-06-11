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
