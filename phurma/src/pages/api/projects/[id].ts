import Router from "@ootiq/next-api-router";
import {
  formsBase,
  getFormBase,
  getFormDrive,
  projectBase,
} from "../../../lib/deta";
import { join } from "../../../lib/utils";
import { FormProps } from "../../../modules/forms/types";
import { ResponseItem } from "../../../modules/responses/types";

interface Body {
  name: string;
}

const projectIdApi = new Router()
  .all((req, res) => {
    res.status(405).json({ error: true, message: "Method not allowed." });
  })

  // delete project
  .delete(async (req, res) => {
    const { id } = req.query;
    if (!id) {
      res
        .status(400)
        .json({ error: true, message: "Missing project key / id." });
      return;
    }

    const projectId = join(id);

    const r = await projectBase.get(projectId);
    if (!r) {
      res.status(404).json({ error: true, message: "Unknown project." });
      return;
    }

    // delete the forms
    const { items: forms } = await formsBase.fetch({ projectKey: projectId });
    for (const i of forms) {
      const form = i as Record<string, any> as FormProps;

      // remove each response
      const fBase = getFormBase(form.key);
      let r = await fBase.fetch();
      let allItems = r.items;

      while (r.last) {
        r = await fBase.fetch({}, { last: r.last });
        allItems.push(...r.items);
      }

      const formDrive = getFormDrive(form.key);

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
      await formsBase.delete(form.key);
    }

    // delete project
    await projectBase.delete(projectId);

    res
      .status(200)
      .json({ error: false, message: "Successfuly removed project." });
  })

  // update the project name
  .patch(async (req, res) => {
    const { id } = req.query;
    if (!id) {
      res
        .status(400)
        .json({ error: true, message: "Missing project key / id." });
      return;
    }

    const projectId = join(id);
    const { name }: Body = req.body;

    if (!name) {
      res.status(400).json({ error: true, message: "No update name set." });
      return;
    }

    const r = await projectBase.get(projectId);
    if (!r) {
      res.status(404).json({ error: true, message: "Unknown project." });
      return;
    }

    await projectBase.update(
      {
        name,
      },
      projectId
    );

    res
      .status(200)
      .json({ error: false, message: "Successfully updated project." });
  })

  // get the project
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
