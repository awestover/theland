// generate a table from a 1d array and a 2d array
function arrayToTable(titles, values)
{
  let output = '<table class="table table-inverse table-bordered">';
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

function arrayToFlippedTable(titles, values)
{
  let output = '<table class="table table-dark table-striped table-bordered table-hover">';
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
