import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/20/solid";
import fileDownload from "js-file-download";
import { useState } from "react";
import { mutate } from "swr";
import { useForms } from "../forms/context";
import { useProject } from "../projects/context";
import DeleteResponse from "./delete-response";
import { ResponseItem } from "./types";

interface ListResponseProps {
  responses: ResponseItem[];
  keys: Record<string, "form" | "file">;
}

const ListResponse = ({ responses, keys }: ListResponseProps) => {
  const { project } = useProject();
  const { form } = useForms();

  const [refreshing, setRefreshing] = useState(false);

  // refresh the responses
  const refreshResponses = async () => {
    setRefreshing(true);

    await mutate(
      project && form ? `/api/forms/${project.key}/${form.key}` : null
    );

    setRefreshing(false);
  };

  // export the responses to csv and download
  const exportResponses = () => {
    const arr = [Object.keys(keys)];

    for (const resp of responses) {
      const r: string[] = [];
      for (const i of Object.keys(keys)) {
        if (keys[i] == "file") {
          const files = resp.files[i]?.map((x) => x.filename);
          r.push(files ? files.join(" ") : "");
        } else {
          r.push(String(resp.content[i]));
        }
      }

      arr.push(r);
    }

    const csvContent = arr.map((e) => e.join(",")).join("\n");
    const encodedUri = csvContent;

    fileDownload(encodedUri, `${form?.name}.csv`);
  };

  return (
    <div className="mb-4 mt-8">
      {responses.length == 0 ? (
        <p className="text-gray-700">No submissions received yet...</p>
      ) : (
        <div>
          <div className="mx-4 my-2 flex flex-wrap items-center justify-end">
            <button
              disabled={refreshing}
              onClick={refreshResponses}
              className="m-1 inline-flex items-center rounded-lg bg-gray-400 py-1 px-4 text-xs text-white duration-300 hover:bg-gray-500 lg:text-sm"
            >
              <ArrowPathIcon className="mr-1 h-4 w-4" />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              onClick={exportResponses}
              className="m-1 inline-flex items-center rounded-lg bg-gray-100 py-1 px-4 text-xs text-gray-900 duration-300 hover:bg-gray-200 lg:text-sm "
            >
              <DocumentArrowDownIcon className="mr-1 h-4 w-4" />
              Export to CSV
            </button>
          </div>

          <div className="rounded-xl border">
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
                                {r.files[x]?.map((f) => (
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
        </div>
      )}
    </div>
  );
};

export default ListResponse;
