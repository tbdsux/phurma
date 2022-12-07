import Router from "@ootiq/next-api-router";
import { ObjectType } from "deta/dist/types/types/basic";
import { getFormBase, projectBase } from "../../../../lib/deta";
import { join } from "../../../../lib/utils";

const formsIdApi = new Router()
  .all((req, res) => {
    res.status(405).json({ error: true, message: "Method not allowed." });
  })
  .get(async (req, res) => {
    const { id, formid } = req.query;

    if (!id || !formid) {
      res.status(400).json({ error: true, message: "Invalid path." });
      return;
    }

    const projectId = join(id);
    const formId = join(formid);

    const project = (await projectBase.get(projectId)) as ObjectType;
    if (project == null) {
      res.status(404).json({ error: true, message: "Unknown project." });
      return;
    }

    const projectForms = project.forms as ObjectType[];
    if (projectForms) {
      const c = projectForms.filter((x) => x.id === formId);
      if (c.length === 0) {
        res.status(404).json({ error: true, message: "Unknown form." });
        return;
      }
    }

    const base = getFormBase(formId);
    let r = await base.fetch();
    let allItems = r.items;

    while (r.last) {
      r = await base.fetch({}, { last: r.last });
      allItems.push(...r.items);
    }

    let itemKeys: Record<string, "form" | "file"> = {};

    for (const i of allItems) {
      const formKeys = Object.keys(i.content as Record<string, any>);
      for (const x of formKeys) {
        if (!Object.keys(itemKeys).includes(x)) {
          itemKeys[x] = "form";
        }
      }

      const fileKeys = Object.keys(i.files as Record<string, any>);
      for (const x of fileKeys) {
        if (!Object.keys(itemKeys).includes(x)) {
          itemKeys[x] = "file";
        }
      }
    }

    res.status(200).json({
      error: false,
      data: { formId, items: allItems, keys: itemKeys },
    });
  })
  .handle();

export default formsIdApi;
