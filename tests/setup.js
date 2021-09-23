//setup told to start first by option object within package.json
jest.setTimeout(30000);

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

//needed because using mongoose v4 not needed in v5+
mongoose.Promise = global.Promise;
// mongoose.connect(keys.mongoURI);
mongoose.connect(keys.mongoURI, { useMongoClient: true });
