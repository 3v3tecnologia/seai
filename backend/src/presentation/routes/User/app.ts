import express from "express";

const app = express();

app.get("/test", (request, response) => {
  return response.status(201).json({
    msg: "Hello my friend",
  });
});

export { app };
