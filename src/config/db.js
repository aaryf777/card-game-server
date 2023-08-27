const mongoose = require('mongoose');
const vars = require('../constants/vars');
mongoose.Promise = Promise;
// mongoose.set('strictQuery' ,true)
mongoose.connection.on('error', (err) => {
    console.warn('unable to establish mongodb connection - ',err);
})
mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb successfully');
})
mongoose.connection.once("open", () => {
  console.log("MongoDB connection opened!");
});
mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected!");
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

exports.connect = () => {
    mongoose.connect(vars.mongo.uri, {
        useNewUrlParser: true,
        dbName: 'Trumpscard'
    }).then(
        console.log(' successfully connected to db')
    )
  //   mongoose.connect(vars.mongo.uri, {
  //     useNewUrlParser: true,
  //     dbName: 'Contests'
  //   }).then(
  //     console.log('Contest successfully connected to db')
  // )
    return mongoose.connection;
}
