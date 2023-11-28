import { env } from "~/env";
import { getCurrentDate, getFutureDate } from "~/app/_lib/utils";
import { load } from "cheerio";
import { getOtelmsFetch } from "./auth";

export const getBookedDates = async () => {
  const { MS_BOOKINGS_URL } = env;
  const customFetch = await getOtelmsFetch();

  const headers = new Headers();

  headers.append("Content-Type", "application/x-www-form-urlencoded");
  headers.append(
    "User-Agent",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  );

  const body = new URLSearchParams();
  body.append("date", `${getCurrentDate()} - ${getFutureDate(24)}`);
  body.append("lines_per_page", "500");
  body.append("date_type", "0");

  const res = await customFetch(MS_BOOKINGS_URL, {
    headers,
    body,
    method: "POST",
  });

  return generateBookingDates(await res.text());
};

const generateBookingDates = (html: string) => {
  console.log(html);
  const $ = load(html);
  const rows = $(".table.dataTable tr");

  const tableData: { name: string; from: string; to: string }[] = [];

  rows.each((index, element) => {
    const tableRowData: string[] = [];

    $(element)
      .find("td")
      .each((index, element) => {
        tableRowData.push($(element).text().trim());
      });

    if (
      tableRowData.length &&
      tableRowData[2] &&
      tableRowData[3] &&
      tableRowData[4]
    ) {
      tableData.push({
        name: tableRowData[2],
        from: tableRowData[3],
        to: tableRowData[4],
      });
    }
  });

  const unique = tableData.reduce((acc, curr) => {
    const name = curr.name.split(" ")[0];
    if (!name) return acc;

    return acc.set(name, [
      ...(acc.get(name) ?? []),
      { from: curr.from, to: curr.to },
    ]);
  }, new Map<string, { from: string; to: string }[]>());

  const res = [];
  for (const [key, value] of unique.entries()) {
    if (Number(key) > 1) {
      res.push({ roomId: Number(key), dates: value });
    }
  }

  return res;
};
