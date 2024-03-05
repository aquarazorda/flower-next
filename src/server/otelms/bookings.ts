import { env } from "~/env";
import { getCurrentDate, getFutureDate } from "~/app/_lib/utils";
import { load } from "cheerio";
import { addDays, format, intervalToDuration } from "date-fns";
import { getOriginalPrice } from "~/app/_lib/prices";
import { err, ok } from "~/app/_lib/ts-results";
import { BookingError } from "../types";

export const getBookedDates = async () => {
  const { MS_URL } = env;

  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const body = new URLSearchParams();
  body.append("date", `${getCurrentDate()} - ${getFutureDate(24)}`);
  body.append("lines_per_page", "500");
  body.append("date_type", "0");

  for (let i = 1; i < 36; i++) {
    body.append("categories[]", String(i));
  }

  for (let i = 0; i < 4; i++) {
    body.append("statuses[]", String(i));
  }

  const res = await fetch(MS_URL + "/reservation_c2/rlist/1", {
    headers,
    body,
    method: "POST",
  });

  return generateBookingDates(await res.text());
};

const generateBookingDates = (html: string) => {
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

type SaveMsBookingProps = {
  msId: number;
  price: number;
  type: "reservation" | "pay";
  paid?: boolean;
  dateRange: {
    from: Date;
    to: Date;
  };
  user: {
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  };
  reservationId: string;
};

export const saveMsBooking = async (data: SaveMsBookingProps) => {
  const { MS_URL } = env;

  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const description = `${data.type === "reservation" ? "Reserved" : "Paid"} from the website, reservationId is ${data.reservationId}`;
  const price = String(
    data.type === "pay" ? getOriginalPrice(data.price, 5) : data.price,
  );

  const body = new URLSearchParams();

  body.append("room_id", String(data.msId));
  body.append("datein", format(addDays(data.dateRange.from, 1), "yyyy-MM-dd"));
  body.append("dateout", format(addDays(data.dateRange.to, 1), "yyyy-MM-dd"));
  body.append("hms_id", "0");
  body.append("insert_or_update_guest_id", "0");
  body.append("firstname", data.user.firstName);
  body.append("lastname", data.user.lastName);
  body.append("phone", data.user.phoneNumber);
  body.append("email", data.user.email);
  body.append("use_dealer_discount", "1");
  body.append("die_option", "0");
  body.append("hotelid", "12228");
  body.append("chainmode", "0");
  body.append("chain_return_link", "0");
  body.append("type_id", String(data.msId - 1));
  body.append("sh", "1");
  body.append("is_guest", "1");
  body.append("dealer", "1");
  body.append("marker_id", "3");
  body.append("checkintime", "13:30");
  body.append("checkouttime", "12:00");
  body.append("description", description);
  body.append("service_main_amount_2", "1");
  body.append("service_main_amount", price);
  body.append("price_type", "1");
  body.append("tourtax", "0");
  body.append("percent_discount", "0");
  body.append("discount", "-" + price);
  body.append("adults", "2");
  body.append("baby_places", "0");
  body.append("babyplace2", "0");
  body.append("addbedplace", "0");
  body.append(
    "duration",
    String(
      intervalToDuration({ start: data.dateRange.from, end: data.dateRange.to })
        .days,
    ),
  );
  body.append("intgroupid", "");
  body.append("avoidtime_days", "");
  body.append("avoidtime_hours", "");
  body.append("avoidtime_minutes", "");
  body.append("cardnumber", "");
  body.append("exp_date", "");
  body.append("cardholder", "");
  body.append("cvc", "");

  try {
    const res = await fetch(MS_URL + "/reservations/save_modal", {
      method: "POST",
      headers,
      body,
    })
      .then((res) => res.text())
      .then((res) => {
        const data = JSON.parse(res);
        if (data.ok === 1 && data.htmldiv) {
          return ok(data.htmldiv.match(/resid="(\d+)"/)[1]);
        }

        return err(BookingError.OTELMS_ERROR);
      });

    return res;
  } catch (e) {
    return err(BookingError.OTELMS_ERROR);
  }
};
