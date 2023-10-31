const mongoose = require("mongoose");

exports.connect = () => {
  mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_LINK}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
};

exports.testConnection = () => {
  mongoose.connect(`mongodb://127.0.0.1/my_test_database}`);
};

exports.closeTestConnection = () => {
  mongoose.connection.close();
};
