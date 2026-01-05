import { Button } from "@/components/ui/button";
import { NotFoundProps } from "@/lib/types";
import Link from "next/link";

export default async function NotFound({
  title,
  description,
  buttonLabel,
  buttonHref,
}: NotFoundProps) {
  return (
    <main className="mx-auto grid min-h-[600px] w-full max-w-6xl place-items-center px-4 py-12">
      <div className="space-y-6 text-center">
        <div className="space-y-1">
          <h1 className="font-bodoni text-3xl">{title ?? "404 Not Found"}</h1>
          <p className="text-foreground/65 mb-4 text-sm">
            {description ??
              "Could not find the page or there might be an internet issue. Please try again."}
          </p>
        </div>
        <Link href={buttonHref ?? "/"}>
          <Button>{buttonLabel ?? "Return Home"}</Button>
        </Link>
      </div>
    </main>
  );
}
