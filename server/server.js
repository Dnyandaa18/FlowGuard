require("dotenv").config();

const app = require("./app");

const {
  connectDatabase,
} = require("./config/database");

const PORT =
  process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(
      PORT,
      () => {
        console.log("");
        console.log(
          "===================================="
        );
        console.log(
          "        FLOWGUARD API SERVER        "
        );
        console.log(
          "===================================="
        );
        console.log(
          "Status : Running"
        );
        console.log(
          `Port   : ${PORT}`
        );
        console.log(
          `API    : http://localhost:${PORT}/api`
        );
        console.log(
          "DB     : Connected"
        );
        console.log(
          "===================================="
        );
        console.log("");
      }
    );
  } catch (error) {
    console.error(
      "Failed to start FlowGuard:",
      error
    );

    process.exit(1);
  }
}

startServer();