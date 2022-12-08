import Router from "@ootiq/next-api-router";
import { ObjectType } from "deta/dist/types/types/basic";
import {
  formsBase,
  getFormBase,
  getFormDrive,
  projectBase,
} from "../../../../lib/deta";
import { join } from "../../../../lib/utils";
import { ResponseItem } from "../../../../modules/responses/types";

const formsIdApi = new Router()
  .all((req, res) => {
    res.status(405).json({ error: true, message: "Method not allowed." });
  })

  // DELETE THE FORM
  .delete(async (req, res) => {
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

    const form = await formsBase.get(formId);
    if (!form || form.projectKey !== projectId) {
      res.status(404).json({ error: true, message: "Unknown form." });
      return;
    }

    // get the form responses
    const fBase = getFormBase(formId);
    let r = await fBase.fetch();
    let allItems = r.items;

    while (r.last) {
      r = await fBase.fetch({}, { last: r.last });
      allItems.push(...r.items);
    }

    const formDrive = getFormDrive(formId);

    // remove all responses under the form
    for (const item of allItems) {
      const response = item as Record<string, any> as ResponseItem;

      // delete the files if there are
      for (const k of Object.keys(response.files)) {
        const files = response.files[k];
        for (const f of files) {
          await formDrive.delete(`${f.file_id}_${f.filename}`);
        }
      }

      // remove the response
      await fBase.delete(response.key);
    }

    // remove the form
    await formsBase.delete(formId);

    res
      .status(200)
      .json({ error: false, message: "Successfully removed form." });
  })

  // FETCH FORM RESPONSES
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

    const form = await formsBase.get(formId);
    if (!form) {
      res.status(404).json({ error: true, message: "Unknown form." });
      return;
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
