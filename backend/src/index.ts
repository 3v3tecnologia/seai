import { app } from "./presentation/routes/user/app";

const port = 80;

app.listen(port, () => {
  console.log(`Server listening in port ${port}`);
});
