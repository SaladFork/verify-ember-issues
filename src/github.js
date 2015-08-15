import GitHubApi from 'github';
import RSVP from 'rsvp';

const github = new GitHubApi({
  version: "3.0.0"//,
  // debug: true
});

export function getIssues(path) {
  return new RSVP.Promise((resolve, reject) => {
    const [ user, repo ] = path.split('/');
    github.issues.repoIssues({ user, repo }, (error, data) => {
      if (error) { reject(error); }
      resolve(data);
    });
  }).then((issues) => issues.filter(issue => !issue.pull_request))
    .then((issues) => issues.filter(issue => issue.state === 'open'))
    .then((issues) => {
      return issues.map((issue) => {
        return {
          number: Number(issue.number),
          title: issue.title.trim(),
          github: issue.html_url.trim(),
          openedBy: issue.user.login.trim(),
          labels: issue.labels.map(label => label.name.trim()).sort().join(',')
        };
      });
    });
}
