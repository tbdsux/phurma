const isDev = process.env.NODE_ENV === "development";
const baseFormUrl = isDev
  ? "http://localhost:8080"
  : `https://${process.env.DETA_SPACE_APP_HOSTNAME}/f`;

export { baseFormUrl };
