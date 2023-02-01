import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import { useForms } from "../forms/context";
import DeleteResponse from "./delete-response";
import { ResponseItem } from "./types";

interface ResponsesProps {
  responses: ResponseItem[];
  keys: Record<string, "form" | "file">;
  sort: string;
}

const ResponsesShowList = ({ responses, keys, sort }: ResponsesProps) => {
  const { form } = useForms();

  return (
    <div>
      {responses
        .sort((x, y) =>
          sort == "latest"
            ? y.created_at - x.created_at
            : x.created_at - y.created_at
        )
        .map((r, index) => (
          <div key={index} className="my-2 rounded-xl border border-gray-100">
            <div className="flex flex-wrap items-center justify-between rounded-t-lg bg-gray-100 p-4">
              <p className="p-1 text-sm text-gray-600">{r.key}</p>

              <div className="inline-flex items-center p-1">
                <small className="mr-2 truncate text-gray-500">
                  {new Date(r.created_at * 1000).toLocaleString()}
                </small>

                <DeleteResponse responseId={r.key} />
              </div>
            </div>

            <ul className="mx-auto w-11/12 py-4">
              {Object.keys(keys).map((x) => (
                <li key={x} className="my-2">
                  <p className="inline-flex items-center rounded-xl bg-gray-200 py-1 px-2 text-sm">
                    {x}
                  </p>

                  {keys[x] == "form" ? (
                    <p className="my-0.5">{JSON.stringify(r.content[x])}</p>
                  ) : (
                    <div className="flex flex-col">
                      {r.files[x]?.map((f) => (
                        <div
                          key={f.file_id}
                          className="my-0.5 inline-flex items-center"
                        >
                          <p className="my-0.5 truncate underline">
                            {f.filename}
                          </p>
                          <a
                            download={f.filename}
                            href={`${form?.url.replace(form.key, "")}files/${
                              form?.key
                            }/${r.key}/${x}/${f.file_id}/${f.filename}`}
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
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default ResponsesShowList;
