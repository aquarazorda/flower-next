"use client";

import { Copy } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { useCopyText } from "~/app/_lib/clipboard";
import { cn } from "~/app/_lib/utils";

export default function CopyInput({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const copy = useCopyText();

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        className="absolute right-2 top-1 z-10 size-8 p-0"
        onClick={() => copy(value)}
      >
        <Copy className="size-3" />
      </Button>
      <Input disabled defaultValue={value} />
    </div>
  );
}
