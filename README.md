<p align="center">
<img src="https://cloud.githubusercontent.com/assets/848347/11104047/423d395c-887b-11e5-8622-129ff63e4565.gif">
</p>

### Electron powered menubar calendar app

### Install

With npm and node (v4.2.1+) installed, do:

```
$ npm install
$ npm start
```

Before you can start the app, you need Google OAuth client credentials with the Calendar API enabled:

1) Create a project here: https://console.developers.google.com/iam-admin/projects?pli=1
2) Go to the API Manager and enable the `Calendar API`
3) Create Credentials > OAuth Client Id, then choose "Other" as the application type

A `./secrets.json` file is required, with the following clientId and clientSecret:

```
{
  "oauth": {
    "clientId": "<your clientId>",
    "clientSecret": "<your clientSecret>"
  }
}
```

### npm scripts

Open dev tools when app is started with:
```
$ npm run dev
```

Clear out your local database with:
```
$ npm run clear-data
```
