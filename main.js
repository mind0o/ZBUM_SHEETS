const { google } = require("googleapis");
const cors = require("cors");
const auth = require("./credentials-load");
var express = require('express');
const { json, text } = require("express");
var app = express();
var textData = "";
var globalRes;
var textData2 = new Array(8000) ;

app.use(cors());

async function run(row=1,col=1,shitToWrite) {
    //create sheets client
    const sheets = google.sheets({ version: "v4", auth });
    //replace a range of values (3x3 grid, starting at H8)
    const res = await sheets.spreadsheets.values.update({
      spreadsheetId: "1Tlgrc9i8uEMJu1EHGSO2VyCkUI7PUxd0ZcmEbyocTRc",
      range: "Sheet1!"  + columnToLetter(col) + "" + row,
      valueInputOption: "RAW",
      resource: {
        values: [
          [shitToWrite + '']
        ]
      }
    });
    //print results
    globalRes.send("done");
    console.log(JSON.stringify(res.data, null, 2));
    // {
    //   "spreadsheetId": "1t1oIvoknE9fye4LAd2ZYzfIYlu49r5Jf6XbwNKt1saE",
    //   "updatedRange": "Sheet1!H8:J10",
    //   "updatedRows": 3,
    //   "updatedColumns": 3,
    //   "updatedCells": 9
    // }
  }

  async function run2(row=1) {
    //create sheets client
    const sheets = google.sheets({ version: "v4", auth });
    //replace a range of values (3x3 grid, starting at H8)
    const res = await sheets.spreadsheets.values.batchClear({
      spreadsheetId: "1Tlgrc9i8uEMJu1EHGSO2VyCkUI7PUxd0ZcmEbyocTRc",
      
      resource: {
        ranges: [
          "Sheet1!A" + row+ ":" +columnToLetter(600)  +  row
        ]
      }
    });
    //print results
    globalRes.send("done");
    console.log(JSON.stringify(res.data, null, 2));
    // {
    //   "spreadsheetId": "1t1oIvoknE9fye4LAd2ZYzfIYlu49r5Jf6XbwNKt1saE",
    //   "updatedRange": "Sheet1!H8:J10",
    //   "updatedRows": 3,
    //   "updatedColumns": 3,
    //   "updatedCells": 9
    // }
  }

app.get('/SHEETS/ReadCell/:row/:col', function(req, res){
  globalRes = res;
  returnData(req.params.row,req.params.col);
  
});

app.get('/SHEETS/ClearRow/:row', function(req, res){
    globalRes = res;
    run2(req.params.row).catch(err => console.error("ERR", err));
    
    
  });

app.get('/SHEETS/WriteCell/:row/:col/:cellData', function(req, res){
    globalRes = res;
    run(req.params.row,req.params.col,req.params.cellData).catch(err => console.error("ERR", err));
    
    
  });

function clearText(){
  textData = "";
}

app.get('/SHEETS/ReadRange/:rangee', function(req, res){
    globalRes = res;
    returnDataRange(req.params.rangee);
    
  });
  app.get('/SHEETS/FindGame/:gameID', function(req, res){
    globalRes = res;
    returnDataID(req.params.gameID.toUpperCase());
    
  });

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



async function returnDataRange(rangee){
  
    //create sheets client
 const sheets = google.sheets({ version: "v4", auth });
 //get a range of values
 const res = await sheets.spreadsheets.values.get({
   spreadsheetId: "1Tlgrc9i8uEMJu1EHGSO2VyCkUI7PUxd0ZcmEbyocTRc",
   range: "Sheet1!"+ rangee
 });
 textData = "";
 for(var i =0; i<res.data.values.length;i++){
     if(JSON.stringify(res.data.values[i][0]) == null){
       textData += " ";
     }else{
       textData += JSON.stringify(res.data.values[i][0]);
     }
     textData += "\n";
 }

 
 textData = textData.replace(/\"/g, "");
 
 console.log(textData);
 globalRes.send(textData);
 return;
 
}



async function returnDataID(val){
  
    //create sheets client
 const sheets = google.sheets({ version: "v4", auth });
 //get a range of values
 const res = await sheets.spreadsheets.values.get({
   spreadsheetId: "1Tlgrc9i8uEMJu1EHGSO2VyCkUI7PUxd0ZcmEbyocTRc",
   range: "Sheet1!B1:B8000"
 });
// console.log(JSON.stringify(res.data.values));
 for(var i =0; i<res.data.values.length;i++){
     if(JSON.stringify(res.data.values[i][0]) == null){
       textData2[i] = " ";
     }else{
       textData2[i] = JSON.stringify(res.data.values[i][0]);
     }
     textData2[i] = textData2[i].replace(/\"/g, "");
   //  console.log(textData[i] );
 }
 
 
 var pos = textData.indexOf(val);

 if(pos < 0){
   globalRes.send("error");
 }else{
   globalRes.send("" + (pos+1));
 }

 
 return;
 
}


//run().catch(err => console.error("ERR", err));

//returnData(1,2).catch(err => console.error("ERR", err));
