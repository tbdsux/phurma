const isDev = process.env.NODE_ENV === "development";
const baseFormUrl = isDev
  ? "http://localhost:4200/f" // TODO: make this auto-configured (as port might change)
  : `https://${process.env.DETA_SPACE_APP_HOSTNAME}/f`;

export { baseFormUrl };
