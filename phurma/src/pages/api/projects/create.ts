import { projectBase } from "../../../lib/deta";
import { router } from "../../../lib/router";

interface Body {
  name: string;
}

export default router
  .put(async (req, res) => {
    const { name }: Body = req.body;
    if (name === "") {
      res.status(400).send({ error: true, message: "No project name set." });
      return;
    }

    const project = {
      name,
      created_at: new Date().getTime(),
      forms: [],
    };

    const r = await projectBase.put(project);
    res.status(200).json({ error: false, data: r });
  })
  .handle();
