const { google } = require("googleapis");
const auth = require("./credentials-load");

async function run() {
  //create sheets client
  const sheets = google.sheets({ version: "v4", auth });
  //get a range of values
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1Tlgrc9i8uEMJu1EHGSO2VyCkUI7PUxd0ZcmEbyocTRc",
    range: "Sheet1!A1:A3"
  });
  //print results
  console.log(JSON.stringify(res.data.values));
  if(JSON.stringify(res.data.values[1][0]) == null){
    console.log("yee");
  }
  console.log(JSON.stringify(res.data.values[1][0]));
}

run().catch(err => console.error("ERR", err));
