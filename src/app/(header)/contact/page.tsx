"use client";

import { Copy } from "lucide-react";
import Instagram from "~/app/_assets/icons/Instagram";
import Phone from "~/app/_assets/icons/Phone";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { useCopyText } from "~/app/_lib/clipboard";
import { inter } from "~/app/_styles/fonts";

const info = {
  phoneNumber: "+995598688686",
  email: "info@flowertbilisi.com",
};

export default function ContactPage() {
  const copy = useCopyText();

  return (
    <div className="lg:mt-12">
      <div className="h-96 p-6">
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
      <div className="flex gap-4 px-6">
        <div className="flex flex-1 gap-2">
          <Input defaultValue={info.phoneNumber} disabled />
          <Button variant="outline" onClick={() => copy(info.phoneNumber)}>
            <Copy className="size-4" />
          </Button>
        </div>
        <div className="flex flex-1 gap-2">
          <Input defaultValue={info.email} disabled />
          <Button variant="outline" onClick={() => copy(info.email)}>
            <Copy className="size-4" />
          </Button>
        </div>
      </div>
      <div
        className={`${inter.className} my-4 flex w-full flex-wrap items-center justify-center gap-4 px-6`}
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
  );
}
