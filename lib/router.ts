import Router from "@ootiq/next-api-router";

export const router = new Router().all((req, res) => {
  res.status(405).json({ error: true, message: "Method not allowed." });
});
