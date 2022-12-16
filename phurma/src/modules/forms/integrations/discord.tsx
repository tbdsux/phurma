import { CheckCircleIcon, PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import { fetcher } from "../../../lib/fetcher";
import { APIResponse } from "../../../typings/api";
import { useProject } from "../../projects/context";
import { useForms } from "../context";
import { DiscordIntegrationProps } from "./types";

const testResponse = () => {
  return {
    content: null,
    embeds: [
      {
        title: "New response! | personal website",
        description: "You have received a new submission from your form.",
        color: 16007006,
        fields: [
          {
            name: "name",
            value: "**John Doe**",
          },
          {
            name: "email",
            value: "john.doe@email.com",
          },
          {
            name: "message",
            value:
              "Hello there! This a test message to see if the discord webhook integration of **phurma** is working perfect and amazing!\nIf you are seeing this message, then it works! Happy hacking!",
          },
        ],
        author: {
          name: "Phurma",
          url: "https://github.com/TheBoringDude/phurma",
          icon_url:
            "https://s3.eu-central-1.amazonaws.com/deta-app-icons.144798365827.eu-central-1/2504e069-58be-4384-a49b-695f86febe62/icons/icon",
        },
        footer: {
          text: "personal website",
        },
        timestamp: new Date().toISOString(),
      },
    ],
    attachments: [],
  };
};

const DiscordIntegration = () => {
  const { project } = useProject();
  const { form } = useForms();

  const { data } = useSWR<APIResponse<DiscordIntegrationProps> | null>(
    project && form
      ? `/api/integrations/${project.key}/${form.key}/discord`
      : null,
    fetcher
  );

  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputWebhookUrl = useRef<HTMLInputElement>(null);

  const saveWebhookUrl = async () => {
    if (!project || !form) {
      return;
    }

    const webhookUrl = inputWebhookUrl.current?.value ?? "";

    setSaving(true);

    const r = await fetch(
      `/api/integrations/${project.key}/${form.key}/discord`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl,
        }),
      }
    );

    const data = await r.json();
    setSaving(false);
    if (!r.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Successfully updated discord integration.");
    await mutate(`/api/integrations/${project.key}/${form.key}/discord`);
  };

  const testSendWebhook = async () => {
    let webhookUrl = inputWebhookUrl.current?.value ?? "";
    if (webhookUrl == "") {
      return;
    }

    if (!webhookUrl.endsWith("?wait=true")) {
      webhookUrl += "?wait=true";
    }

    setTesting(true);

    try {
      const r = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(testResponse()),
      });

      const data = await r.json();
      setTesting(false);
      if (!r.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Successfully send test response.");
    } catch (e) {
      toast.error(String(e));
    }
  };

  return (
    <div className="my-3 mx-auto w-11/12">
      <h5 className="text-lg font-medium uppercase text-gray-700">
        Discord Webhook
      </h5>

      <div className="mt-2">
        <div className="flex flex-col">
          <label htmlFor="url" className="text-gray-500">
            Webhook Url
          </label>
          <div className="flex flex-col items-end justify-between md:flex-row md:items-stretch">
            <div className="relative m-1 flex w-full items-center">
              <input
                ref={inputWebhookUrl}
                type="url"
                name="url"
                id="url"
                defaultValue={data?.data?.webhookUrl}
                className="w-full rounded-xl border py-3 pl-4 pr-28 text-sm"
                placeholder="https://discord.com/api/webhooks/..."
              />

              <button
                onClick={testSendWebhook}
                disabled={testing}
                className="absolute inset-y-auto right-4 inline-flex items-center justify-between rounded-lg bg-gray-400 py-1 px-4 text-sm font-medium text-white duration-300 hover:bg-gray-500 disabled:bg-gray-400 disabled:opacity-90"
              >
                {testing ? "Test..." : "Test"}
                <PaperAirplaneIcon
                  className="ml-1 h-3 w-3"
                  aria-hidden="true"
                />
              </button>
            </div>

            <button
              onClick={saveWebhookUrl}
              disabled={saving}
              className="m-1 inline-flex items-center justify-between rounded-xl bg-rose-400 py-3 px-8 font-medium text-white duration-300 hover:bg-rose-500 disabled:opacity-90 disabled:hover:bg-rose-400"
            >
              <CheckCircleIcon className="mr-1 h-3 w-3" aria-hidden="true" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordIntegration;
