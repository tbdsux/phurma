import { ArrayType, ObjectType } from "deta/dist/types/types/basic";
import { nanoid } from "nanoid";
import { projectBase } from "../../../lib/deta";
import { router } from "../../../lib/router";
import { join } from "../../../lib/utils";

export default router
  .get(async (req, res) => {
    const { id } = req.query;
    if (!id) {
      return;
    }

    const r = await projectBase.get(join(id));

    res.status(200).json({ error: false, data: r });
  })
  .post(async (req, res) => {
    const { id } = req.query;
    if (!id) {
      return;
    }

    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: true, message: "Invalid request body." });
      return;
    }

    const project = (await projectBase.get(join(id))) as ObjectType;
    if (project == null) {
      res.status(404).json({ error: true, message: "Project does not exist." });
      return;
    }

    const form = {
      name,
      id: nanoid(),
      created_at: new Date().getTime(),
    };

    const forms = (project.forms as ArrayType) ?? [];
    forms.push(form);

    await projectBase.update(
      {
        forms,
      },
      join(id)
    );

    res.status(200).json({
      error: false,
      message: "Successfully created new form in the project.",
    });
  })
  .handle();
