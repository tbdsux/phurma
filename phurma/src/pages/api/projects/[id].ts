import Router from "@ootiq/next-api-router";
import { projectBase } from "../../../lib/deta";
import { join } from "../../../lib/utils";

const projectIdApi = new Router()
  .all((req, res) => {
    res.status(405).json({ error: true, message: "Method not allowed." });
  })
  .get(async (req, res) => {
    const { id } = req.query;
    if (!id) {
      res
        .status(400)
        .json({ error: true, message: "Missing project key / id." });
      return;
    }

    const r = await projectBase.get(join(id));

    res.status(200).json({ error: false, data: r });
  })
  .handle();

export default projectIdApi;
