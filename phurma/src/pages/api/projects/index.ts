import { projectBase } from "../../../lib/deta";
import { router } from "../../../lib/router";

export default router
  .get(async (req, res) => {
    let r = await projectBase.fetch();
    let allItems = r.items;

    while (r.last) {
      r = await projectBase.fetch({}, { last: r.last });
      allItems.push(...r.items);
    }

    res.status(200).json({ error: false, data: allItems });
  })
  .handle();
