import { getFormBase, projectBase } from "../../../../lib/deta";
import { router } from "../../../../lib/router";
import { join } from "../../../../lib/utils";

export default router
  .get(async (req, res) => {
    const { id, formid } = req.query;

    if (!id || !formid) {
      res.status(400).json({ error: true, message: "Invalid path." });
      return;
    }

    const projectId = join(id);
    const formId = join(formid);

    const project = projectBase.get(projectId);
    if (project == null) {
      res.status(404).json({ error: true, message: "Unknown project." });
      return;
    }

    const base = getFormBase(formId);
    let r = await base.fetch();
    let allItems = r.items;

    while (r.last) {
      r = await base.fetch({}, { last: r.last });
      allItems.push(...r.items);
    }

    res.status(200).json({ error: false, data: { formId, items: allItems } });
  })
  .handle();
