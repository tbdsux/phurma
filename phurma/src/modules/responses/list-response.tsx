import { Listbox, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  CheckIcon,
  ChevronUpDownIcon,
  DocumentArrowDownIcon
} from "@heroicons/react/20/solid";
import fileDownload from "js-file-download";
import { Fragment, useState } from "react";
import { mutate } from "swr";
import { useForms } from "../forms/context";
import { useProject } from "../projects/context";
import ResponsesShowList from "./show-list";
import ResponsesShowTable from "./show-table";
import { ResponseItem } from "./types";

interface ListResponseProps {
  responses: ResponseItem[];
  keys: Record<string, "form" | "file">;
}

interface ListOptionsProps {
  name: string;
  id: string;
}

type SortOptionProps = ListOptionsProps;

const sortOptions: SortOptionProps[] = [
  {
    name: "Latest First",
    id: "latest",
  },
  {
    name: "Start from First",
    id: "first",
  },
];

const listOptions: ListOptionsProps[] = [
  { name: "Show as Table", id: "table" },
  {
    name: "Individual List",
    id: "list",
  },
];

const ListResponse = ({ responses, keys }: ListResponseProps) => {
  const { project } = useProject();
  const { form } = useForms();

  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(listOptions[0]);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

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
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="w-full md:w-72">
              <Listbox value={selected} onChange={setSelected}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-100 py-2 pl-3 pr-10 text-left text-sm text-gray-700 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                    <span className="block truncate">{selected.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {listOptions.map((opt, idx) => (
                        <Listbox.Option
                          key={idx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-rose-100 text-rose-900"
                                : "text-gray-900"
                            }`
                          }
                          value={opt}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {opt.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-rose-600">
                                  <CheckIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            <div className="mx-4 my-2 flex flex-wrap items-center justify-center">
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

              <div className="w-56">
                <Listbox value={selectedSort} onChange={setSelectedSort}>
                  <div className="relative">
                    <Listbox.Button className="relative z-20 m-1 w-full cursor-default rounded-lg bg-gray-100 py-1 pl-3 pr-10 text-left text-sm text-gray-700 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                      <span className="block truncate">
                        {selectedSort.name}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {sortOptions.map((opt, idx) => (
                          <Listbox.Option
                            key={idx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-rose-100 text-rose-900"
                                  : "text-gray-900"
                              }`
                            }
                            value={opt}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {opt.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-rose-600">
                                    <CheckIcon
                                      className="h-4 w-4"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>

          {selected.id == "list" ? (
            <ResponsesShowList responses={responses} keys={keys} sort={selectedSort.id} />
          ) : (
            <ResponsesShowTable responses={responses} keys={keys} sort={selectedSort.id} />
          )}
        </div>
      )}
    </div>
  );
};

export default ListResponse;
