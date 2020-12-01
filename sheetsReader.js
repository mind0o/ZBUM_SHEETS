const { google } = require("googleapis");
const auth = require("./credentials-load");
var express = require('express');
const { json, text } = require("express");
var app = express();
var textData = "";
var globalRes;

async function run() {
  //create sheets client
  const sheets = google.sheets({ version: "v4", auth });
  //get a range of values
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1Tlgrc9i8uEMJu1EHGSO2VyCkUI7PUxd0ZcmEbyocTRc",
    range: "Sheet1!A1" 
  });
  //print results
  console.log(JSON.stringify(res.data, null, 2));
}

app.get('/readSheets/data/:row/:col', function(req, res){
  globalRes = res;
  returnData(req.params.row,req.params.col);
  
});

function clearText(){
  textData = "";
}

app.listen(3000);

async function returnData(row=1,col=1){
  
     //create sheets client
  const sheets = google.sheets({ version: "v4", auth });
  //get a range of values
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1Tlgrc9i8uEMJu1EHGSO2VyCkUI7PUxd0ZcmEbyocTRc",
    range: "Sheet1!"  + columnToLetter(col) + "" + row
  });
  if(res.data.hasOwnProperty('values')){
    textData = JSON.stringify(res.data.values[0][0]);
  textData = textData.replace(/\"/g, "");
  }else{
    textData = "";
  }
  console.log(textData);
  globalRes.send(textData);
  return;
  
}



function columnToLetter(column)
{
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

async function letterToColumn(letter)
{
  var column = 0, length = letter.length;
  for (var i = 0; i < length; i++)
  {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}



//run().catch(err => console.error("ERR", err));

//returnData(1,2).catch(err => console.error("ERR", err));
