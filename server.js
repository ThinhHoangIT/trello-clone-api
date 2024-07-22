const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const boardRoute = require("./routes/boardRoute");
const listRoute = require("./routes/listRoute");
const cardRoute = require("./routes/cardRoute");
const auth = require("./middlewares/auth");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Custom middleware to skip auth for specific routes
const skipAuth = (req, res, next) => {
  const openPaths = [
    { url: "/user/login", method: "POST" },
    { url: "/user/register", method: "POST" },
  ];

  const isPathOpen = openPaths.some(
    (path) => path.url === req.path && path.method === req.method
  );

  if (isPathOpen) {
    return next();
  }

  return auth.verifyToken(req, res, next);
};

app.use(skipAuth);

//MONGODB CONNECTION

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection is succesfull!");
  })
  .catch((err) => {
    console.log(`Database connection failed!`);
    console.log(`Details : ${err}`);
  });

//ROUTES

app.use("/user", userRoute);
app.use("/board", boardRoute);
app.use("/list", listRoute);
app.use("/card", cardRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is online! Port: ${process.env.PORT}`);
});
