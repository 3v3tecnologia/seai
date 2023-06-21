import { setupApp } from "./app";
import { terminate } from "./gracefull-shutdown";

import env from "./env";

const app = await setupApp();

const server = app.listen(env.port, () => {
  console.log(`Server listening in port ${env.port}`);
});

const exitHandler = terminate(server, {
  timeout: 1000,
  coredump: false,
});

// programmer errors = let this program crash!
process.on("uncaughtException", exitHandler(1, "Unexpected Error"));

// SIGTERM is normally sent by a process monitor to tell Node.js to expect a successful termination.
process.on("SIGTERM", exitHandler(0, "SIGTERM"));

// SIGINT is emitted when a Node.js process is interrupted, usually as the result of a control-C (^-C) keyboard event
process.on("SIGINT", exitHandler(0, "SIGINT"));

process.on("exit", (code) => {
  // Only synchronous calls, please!
  console.log(`Process exited with code: ${code}`);
});
