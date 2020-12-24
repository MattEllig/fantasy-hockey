This app is intended to contain various fantasy hockey tools which are based on others I\'ve created for myself over the years (usually in spreadsheets).

See a live example running [here](https://f-hockey.herokuapp.com/).

## Instructions

To install this app on your computer, clone the repository and install dependencies.

```
$ git clone https://github.com/mattellig/fantasy-hockey-tools.git
$ cd fantasy-hockey-tools
$ npm install
```

The server uses environment variables for configuration. The following values are required:

```
// Google OAuth 2.0
GOOGLE_CLIENT_ID=__GOOGLE_CLIENT_ID__
GOOGLE_CLIENT_SECRET=__GOOGLE_CLIENT_SECRET__

// MongoDB connection
MONGO_URI=__MONGO_DB_URI__

// session key
SESSION_KEY=__SESSION_KEY__
```

Use the following command to run the server with nodemon:

```
$ npm run dev
```