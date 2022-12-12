import { GetServerSideProps } from "next";
import FilesNotAllowedPage from "../modules/custom-pages/files-not-allowed";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.statusCode = 500;
  return { props: {} };
};

export default FilesNotAllowedPage;
