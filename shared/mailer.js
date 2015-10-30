var Q = require('q');
var google = require('googleapis');
var gmail = google.gmail('v1');

export default class Mailer {


  /*
   * Store the auth client to use with api calls
   */

  setAuth(oauth) {
    this.oauth = oauth;
  }


  /*
   * Use the gmail api to send the mail
   */

  send(msg) {
    return Q.nfcall(gmail.users.messages.send, {
      auth: this.oauth.client,
      userId: 'me',
      resource: {
        raw: this._convertMsg(msg)
      }
    }).then((res) => {
      return res[0];
    });
  }


  /*
   * Convert the msg object to the base64 encoded string
   */

  _convertMsg(msg) {
    var lines = [];
    lines.push("From: " + `${msg.from.name} <${msg.from.email}>`);
    lines.push("To: " + msg.to.map(r => `${r.name} <${r.email}>`).join(', '));
    lines.push("Content-type: text/html;charset=iso-8859-1");
    lines.push("MIME-Version: 1.0");
    lines.push("Subject: " + msg.subject);
    lines.push("");
    lines.push(msg.body);
    var email = lines.join("\r\n").trim();
    var base64EncodedEmail = btoa(email).replace(/\//g,'_').replace(/\+/g,'-');
    return base64EncodedEmail;
  }
}
