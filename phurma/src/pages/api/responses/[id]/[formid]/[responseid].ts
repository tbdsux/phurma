import Router from "@ootiq/next-api-router";
import { ObjectType } from "deta/dist/types/types/basic";
import {
  getFormBase,
  getFormDrive,
  projectBase,
} from "../../../../../lib/deta";
import { join } from "../../../../../lib/utils";
import { ResponseItem } from "../../../../../modules/responses/types";

const deleteResponseApi = new Router()
  .all((req, res) => {
    res.status(405).json({ error: true, message: "Method not allowed." });
  })
  .delete(async (req, res) => {
    const { id, formid, responseid } = req.query;

    if (!id || !formid || !responseid) {
      res
        .status(400)
        .json({ error: true, message: "Missing some path params / query." });
      return;
    }

    const projectId = join(id);
    const formId = join(formid);
    const responseId = join(responseid);

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

    const formBase = getFormBase(formId);
    const resp = await formBase.get(responseId);
    if (resp == null) {
      res.status(404).json({ error: true, message: "Unknown response id." });
      return;
    }

    const response = resp as Record<string, any> as ResponseItem;

    // delete the files if there are
    const formDrive = getFormDrive(formId);
    for (const k of Object.keys(response.files)) {
      const files = response.files[k];
      for (const f of files) {
        await formDrive.delete(`${f.file_id}_${f.filename}`);
      }
    }

    // delete the response
    await formBase.delete(responseId);

    res
      .status(200)
      .json({ error: false, message: "Successfully deleted the response." });
  })
  .handle();

export default deleteResponseApi;
