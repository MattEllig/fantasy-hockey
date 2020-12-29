This app is intended to contain various fantasy hockey tools which are based on others I\'ve created for myself over the years (usually in spreadsheets). I\'m also using it as a way to learn about the **MERN** stack (**M**ongoDB, **E**xpress, **R**eact, **N**ode).

See the app running live [here](https://f-hockey.herokuapp.com/).

## Instructions

To install this app on your computer, clone the repository and install dependencies.

```
$ git clone https://github.com/mattellig/fantasy-hockey-tools.git
$ cd fantasy-hockey-tools
$ npm install
```

The server uses environment variables for configuration.

```
# Google OAuth 2.0
GOOGLE_CLIENT_ID=__GOOGLE_CLIENT_ID__
GOOGLE_CLIENT_SECRET=__GOOGLE_CLIENT_SECRET__

# MongoDB connection
MONGO_URI=__MONGO_DB_URI__

# session key
SESSION_KEY=__SESSION_KEY__
```

Once those are set, you can start the app.

```
$ npm run dev
```