import Router from "@ootiq/next-api-router";
import { projectBase } from "../../../lib/deta";

interface Body {
  name: string;
}

const createProjectApi = new Router()
  .all((req, res) => {
    res.status(405).json({ error: true, message: "Method not allowed." });
  })
  .put(async (req, res) => {
    const { name }: Body = req.body;
    if (name === "") {
      res.status(400).send({ error: true, message: "No project name set." });
      return;
    }

    const project = {
      name,
      created_at: new Date().getTime(),
    };

    const r = await projectBase.put(project);
    res.status(200).json({ error: false, data: r });
  })
  .handle();

export default createProjectApi;
