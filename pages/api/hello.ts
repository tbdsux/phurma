import { router } from "../../lib/router";

export default router
  .get((req, res) => {
    res.send("Hello world");
  })
  .handle();
