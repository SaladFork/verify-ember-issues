import GoogleSpreadsheet from 'google-spreadsheet';
import RSVP from 'rsvp';

export function getIssues(key) {
  return new RSVP.Promise((resolve, reject) => {
    getSpreadsheet(key).then((spreadsheet) => {
      spreadsheet.getRows(1, {}, (error, data)=> {
        if (error) { reject(error); }
        resolve(data);
      });
    });
  }).then((rows) => {
    return rows.map((row) => {
      return {
        number: Number(row._cn6ca), // '#' hopefully
        title: row.title.trim(),
        github: row.githubhref.trim(),
        openedBy: row.openedby.trim(),
        labels: parseLabels(row.labelsgreensuggested).sort()
      };
    });
  });
}

let issuesSpreadsheet;

function getSpreadsheet(key) {
  if (!issuesSpreadsheet) {
    issuesSpreadsheet = new GoogleSpreadsheet(key);
  }

  return RSVP.resolve(issuesSpreadsheet);
}
function parseLabels(labelsString) {
  return labelsString.split(/,\//)
    .map(s => s.trim())
    .filter(s => s.indexOf('Old') === -1)
    .filter(s => s.length > 0);
}
