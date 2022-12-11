import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import { useProject } from "../projects/context";
import DeleteResponse from "./delete-response";
import { ResponseItem } from "./types";

interface ListResponseProps {
  responses: ResponseItem[];
  keys: Record<string, "form" | "file">;
}

const ListResponse = ({ responses, keys }: ListResponseProps) => {
  const { form } = useProject();

  return (
    <>
      {responses.length == 0 ? (
        <p className="text-gray-700">No submissions received yet...</p>
      ) : (
        <div className="my-4 mt-8 rounded-xl border">
          <div className="my-8 overflow-auto">
            <table className="w-full table-auto border-collapse overflow-auto text-left">
              <thead>
                <tr className="p-6">
                  {Object.keys(keys).map((x) => (
                    <th className="border-b px-6 py-4" key={x}>
                      {x}
                    </th>
                  ))}
                  <th className="border-b"></th>
                </tr>
              </thead>

              <tbody>
                {responses
                  .sort((x, y) => y.created_at - x.created_at)
                  .map((r) => (
                    <tr key={r.key} className="p-6">
                      {Object.keys(keys).map((x) =>
                        keys[x] === "form" ? (
                          <td className="border-b px-6 py-3" key={x}>
                            {r.content[x]}
                          </td>
                        ) : (
                          <td className="border-b px-6 py-3" key={x}>
                            <div className="flex flex-col">
                              {r.files[x].map((f) => (
                                <div
                                  key={f.file_id}
                                  className="my-0.5 inline-flex items-center"
                                >
                                  <p className="truncate rounded-xl bg-gray-200 px-2 py-0.5 text-sm">
                                    {f.filename}
                                  </p>
                                  <a
                                    download={f.filename}
                                    href={`${form?.url.replace(
                                      form.key,
                                      ""
                                    )}files/${form?.key}/${r.key}/${x}/${
                                      f.file_id
                                    }/${f.filename}`}
                                    className="ml-2 rounded-md bg-gray-400 p-0.5 text-white duration-300 hover:bg-gray-500"
                                    title="Download File"
                                  >
                                    <ArrowDownTrayIcon
                                      aria-hidden="true"
                                      className="h-3 w-3"
                                    />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </td>
                        )
                      )}

                      <td className="border-b px-3">
                        <DeleteResponse responseId={r.key} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default ListResponse;
