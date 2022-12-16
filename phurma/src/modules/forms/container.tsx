import { Tab } from "@headlessui/react";
import { useProject } from "../projects/context";
import ListResponse from "../responses/list-response";
import { useForms } from "./context";
import CopyForm from "./copy-form";
import FormUsage from "./usage";
import useGetForm from "./useGetForm";

const FormsContainer = () => {
  const { project } = useProject();
  const { form } = useForms();
  const responses = useGetForm(project?.key, form?.key);

  return (
    <div className="mt-6">
      {project && form ? (
        <Tab.Group>
          <div className="m-1 flex flex-wrap items-center justify-between">
            <Tab.List className="rounded-lg bg-gray-100">
              <Tab
                className={({ selected }) =>
                  `mx-0.5 rounded-lg px-3 py-1 text-sm  ${
                    selected
                      ? "bg-gray-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`
                }
              >
                View Responses
              </Tab>

              <Tab
                className={({ selected }) =>
                  `mx-0.5 rounded-lg px-3 py-1 text-sm  ${
                    selected
                      ? "bg-gray-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`
                }
              >
                Usage
              </Tab>
            </Tab.List>

            <CopyForm />
          </div>

          <Tab.Panels>
            <Tab.Panel>
              {responses ? (
                <ListResponse
                  responses={responses.items}
                  keys={responses.keys}
                />
              ) : (
                <></>
              )}
            </Tab.Panel>

            <Tab.Panel>
              <FormUsage />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      ) : (
        <p className="text-sm text-gray-600">
          Select a form to view the responses....
        </p>
      )}
    </div>
  );
};

export default FormsContainer;
