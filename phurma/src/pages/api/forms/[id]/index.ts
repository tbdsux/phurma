import Router from "@ootiq/next-api-router";
import { formsBase, projectBase } from "../../../../lib/deta";
import { baseFormUrl } from "../../../../lib/server";
import { join } from "../../../../lib/utils";

const formsApi = new Router()
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

    const projectKey = join(id);

    const project = await projectBase.get(projectKey);
    if (project == null) {
      res.status(404).json({ error: true, message: "Project does not exist." });
      return;
    }

    const { items } = await formsBase.fetch({ projectKey });

    items.forEach((item) => {
      item.url = baseFormUrl + `/${item.key}`;
    });

    res.status(200).json({ error: false, data: items });
  })
  .put(async (req, res) => {
    const { id } = req.query;

    if (!id) {
      res
        .status(400)
        .json({ error: true, message: "Missing project key / id." });
      return;
    }

    const projectKey = join(id);

    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: true, message: "Invalid request body." });
      return;
    }

    const project = await projectBase.get(projectKey);
    if (project == null) {
      res.status(404).json({ error: true, message: "Project does not exist." });
      return;
    }

    const form = {
      name,
      created_at: new Date().getTime(),
      projectKey,
    };

    const r = await formsBase.put(form);

    res.status(200).json({
      error: false,
      data: r,
      message: "Successfully created new form in the project.",
    });
  })
  .handle();

export default formsApi;
