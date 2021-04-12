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

A database seeder will run the first time the server is started, using the NHL API to retrieve information on each team and active player to save to your MongoDB. Players who have not played in the current season are ignored. **Please keep in mind this is a slow process and may take some time to complete.** You can control the minimum number of games for players seeded in [config.json](config.json).

## Acknowledgements

[Drew Hynes](https://pure-defect.com/) for his incredible work [documenting the NHL API](https://gitlab.com/dword4/nhlapi).

------------

NHL and the NHL Shield are registered trademarks of the National Hockey League. NHL and NHL team marks are the property of the NHL and its teams. © NHL 2021. All Rights Reserved.
