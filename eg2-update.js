const { google } = require("googleapis");
const auth = require("./credentials-load");

async function run() {
  //create sheets client
  const sheets = google.sheets({ version: "v4", auth });
  //replace a range of values (3x3 grid, starting at H8)
  const res = await sheets.spreadsheets.values.bat({
    spreadsheetId: "14eRPSjnCq2rCqSeO8T8Kz-ISzLBPzBV5I2iEdAPYDUI",
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    resource: {
      values: [
        ["no license"]
      ]
    }
  });
  //print results
  console.log(JSON.stringify(res.data, null, 2));
  // {
  //   "spreadsheetId": "1t1oIvoknE9fye4LAd2ZYzfIYlu49r5Jf6XbwNKt1saE",
  //   "updatedRange": "Sheet1!H8:J10",
  //   "updatedRows": 3,
  //   "updatedColumns": 3,
  //   "updatedCells": 9
  // }
}

run().catch(err => console.error("ERR", err));
