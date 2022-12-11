import Router from "@ootiq/next-api-router";
import { ObjectType } from "deta/dist/types/types/basic";
import { formsBase, projectBase } from "../../../../../lib/deta";
import { join } from "../../../../../lib/utils";

interface Body {
  allowFiles: boolean;
  redirectUrl: string;
}

const miscFormsApi = new Router()
  .all((req, res) => {
    res.status(405).json({ error: true, message: "Method not allowed." });
  })

  // update misc settings
  .patch(async (req, res) => {
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

    const { allowFiles, redirectUrl }: Body = req.body;
    await formsBase.update(
      {
        allowFiles,
        redirectUrl,
      },
      formId
    );

    res
      .status(200)
      .json({ error: false, message: "Successfully updated misc settings." });
  })
  .handle();

export default miscFormsApi;
