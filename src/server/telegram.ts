import { env } from "~/env";

export const sendTelegramMessage = async (text: string) => {
  const { TG_CHAT_ID, TG_BOT_TOKEN } = env;
  const url = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: TG_CHAT_ID,
    text,
    parse_mode: "html",
  };

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
