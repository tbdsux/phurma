import Router from "@ootiq/next-api-router";
import { ObjectType } from "deta/dist/types/types/basic";
import {
  discordIntegrationBase,
  formsBase,
  projectBase
} from "../../../../../lib/deta";
import { join } from "../../../../../lib/utils";
import { DiscordIntegrationProps } from "../../../../../modules/forms/integrations/types";

interface Body {
  webhookUrl?: string;
  enabled?: boolean;
}

const discordIntegration = new Router()
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

    const form = await formsBase.get(formId);
    if (!form || form.projectKey !== projectId) {
      res.status(404).json({ error: true, message: "Unknown form." });
      return;
    }

    const r = await discordIntegrationBase.get(formId);
    res.status(200).json({ error: false, data: r });
  })

  // post update
  .post(async (req, res) => {
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

    const { webhookUrl, enabled }: Body = req.body;
    if (webhookUrl == null) {
      res.status(400).json({ error: true, message: "Webhook url is null." });
      return;
    }

    // update integration details
    const integration: DiscordIntegrationProps = {
      key: formId,
      enabled: enabled ? enabled : false,
      webhookUrl: webhookUrl ?? "",
    };

    await discordIntegrationBase.put({ ...integration });
    res.status(200).json({
      error: false,
      message: "Successfully updated form's discord integration.",
    });
  })

  .handle();

export default discordIntegration;
