const express = require("express");
const port = 3000;

const app = express();

app.all("/", (req, res) => {
  res.send("Bot is running!");
});

function keepAlive() {
  app.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
}

module.exports = keepAlive;
