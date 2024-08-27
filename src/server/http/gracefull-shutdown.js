import { setTimeout } from "node:timers";

export function terminate(server, options = { coredump: false, timeout: 500 }) {
  // Exit function
  const exit = (code) => {
    console.log("code ", code);
    options.coredump ? process.abort() : process.exit(0);
  };

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      // Log error information, use a proper logging library here :)
      console.log(err.message, err.stack);
    }

    // Attempt a graceful shutdown
    server.close(exit);

    const interval = setTimeout(exit, options.timeout);
    interval.unref();
  };
}
