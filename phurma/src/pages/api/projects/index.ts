import Router from "@ootiq/next-api-router";
import { projectBase } from "../../../lib/deta";

const projectsApi = new Router()
  .all((req, res) => {
    res.status(405).json({ error: true, message: "Method not allowed." });
  })
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

export default projectsApi;
