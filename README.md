## Usage

```
$ SHEET_KEY=<SHEET_KEY> npm run start
```

Where `<SHEET_KEY>` is the Google Spreadsheet key for the issue triage spreadsheet.

## Known Issues

 * Label matching seems to have issue with spaces
 * Only seems to compare a small number of total issues (paging via GitHub API necessary?)
