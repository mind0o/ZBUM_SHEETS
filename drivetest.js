const { google } = require("googleapis");
const auth = require("./credentials-load");

async function run() {
  //create sheets client
  const drive = google.drive({ version: "v3", auth });
  //get a range of values
 /* const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1t1oIvoknE9fye4LAd2ZYzfIYlu49r5Jf6XbwNKt1saE",
    range: "Sheet1!A1:A1"
  });*/
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
  //print results
 // console.log(JSON.stringify(res.data, null, 2));
}

run().catch(err => console.error("ERR", err));
