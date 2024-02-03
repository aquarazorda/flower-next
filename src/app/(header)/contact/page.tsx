"use client";

import { Copy } from "lucide-react";
import Instagram from "~/app/_assets/icons/Instagram";
import Phone from "~/app/_assets/icons/Phone";
import { Button } from "~/app/_components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "~/app/_components/ui/table";
import { useCopyText } from "~/app/_lib/clipboard";
import { cn } from "~/app/_lib/utils";
import { inter } from "~/app/_styles/fonts";

const info = {
  phoneNumber: "+995598688686",
  email: "info@flowertbilisi.com",
};

export default function ContactPage() {
  const copy = useCopyText();

  return (
    <div className="flex flex-col lg:flex-row lg:py-20">
      <div className="h-96 flex-1 p-6 lg:h-[60dvh]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2979.436417580777!2d44.79803947643907!3d41.68951357720013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cf2358c2f91%3A0xc0d3daaf99fd2b62!2sHotel%20Flower!5e0!3m2!1sen!2sge!4v1703108979366!5m2!1sen!2sge"
          width="100%"
          height="100%"
          allowFullScreen={false}
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div
        className={cn(
          inter.className,
          "flex flex-1 flex-col gap-2 px-2 lg:pr-6",
        )}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Phone number</TableCell>
              <TableCell>+995 598 688 686</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="size-8 p-0"
                  onClick={() => copy(info.phoneNumber)}
                >
                  <Copy className="size-3" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>{info.email}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="size-8 p-0"
                  onClick={() => copy(info.email)}
                >
                  <Copy className="size-3" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>36a Lado Asatiani Street, Tbilisi</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="size-8 p-0"
                  onClick={() => copy("36a Lado Asatiani Street, Tbilisi")}
                >
                  <Copy className="size-3" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div
          className={`my-4 mt-auto flex w-full flex-wrap items-center justify-center gap-4 px-2`}
        >
          <Button asChild variant={"outline"} className="flex-1 gap-2">
            <a href={`tel:${info.phoneNumber}`}>
              <Phone style={{ width: "20px", height: "20px" }} />
              Call
            </a>
          </Button>
          <Button asChild variant={"outline"} className="flex-1 gap-2">
            <a href="https://www.instagram.com/hotel_flower_tbilisi/">
              <Instagram style={{ width: "20px", height: "20px" }} />
              Instagram
            </a>
          </Button>
          <Button asChild variant={"outline"} className="flex-1 gap-2">
            <a href={`https://wa.me/${info.phoneNumber}`}>
              <img
                src="/icons/whatsapp.svg"
                style={{ width: "20px", height: "20px" }}
              />
              Whatsapp
            </a>
          </Button>
          <Button asChild variant={"outline"} className="flex-1 gap-2">
            <a href={`https://t.me/${info.phoneNumber}`}>
              <img
                style={{ width: "20px", height: "20px" }}
                src="/icons/telegram.svg"
              />
              Telegram
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
