// generate a table from a 1d array and a 2d array
function arrayToTable(titles, values)
{
  let output = '<table class="table">';
  output += '<thread>';
  for (let i in titles)
  {
    output+='<th>' + titles[i] + '</th>';
  }
  output += '</thread>';

  output += '<tbody>';

  for (let j in values[0])
  {
    output += '<tr>';
    for (let i in values)
    {
      output+='<td>';
      output+=values[i][j];
      output+='</td>';
    }
    output+='</tr>';
  }

  output += '</tbody>';
  output += '</table>';
  return output;
}

function jsonToTable(titles, jsonData)
{
  let rs = [];
  let vals = [];
  for (let key in jsonData)
  {
    rs.push(key);
    if (typeof(jsonData[key]) == "number")
    {
      if (jsonData[key] %1 ==0)
      {
        vals.push(jsonData[key]);
      }
      else {
        vals.push(jsonData[key].toFixed(5).toString());
      }
    }
    else {
      vals.push(jsonData[key]);
    }
  }
  return arrayToTable(titles, [rs, vals]);
}

function arrayToFlippedTable(titles, values)
{
  let output = '<table class="table table-striped table-bordered table-hover">';
  output += '<thread>';
  for (let i in titles)
  {
    output+='<th>' + titles[i] + '</th>';
  }
  output += '</thread>';

  output += '<tbody>';

  for (let i in values)
  {
    output += '<tr>';
    for (let j in values[i])
    {
      output+='<td>';
      output+=values[i][j];
      output+='</td>';
    }
    output+='</tr>';
  }

  output += '</tbody>';
  output += '</table>';
  return output;
}

function flattenJson(vals)
{
  let newVals = {};
  for (let i in vals)
  {
    if (typeof(vals[i]) == "object")
    {
      for (x in vals[i])
      {
        newVals[i+" "+x] = vals[i][x];
      }
    }
    else {
      newVals[i] = vals[i];
    }
  }
  return newVals;
}
