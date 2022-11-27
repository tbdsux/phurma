import { projectBase } from "../../../lib/deta";
import { router } from "../../../lib/router";

interface Body {
  name: string;
}

export default router
  .put(async (req, res) => {
    const body: Body = req.body;
    if (body.name === "") {
      res.status(400).send({ error: true, message: "No project name set." });
      return;
    }

    const r = await projectBase.put({ ...body });
    res.status(200).json(r);
  })
  .handle();
