"use client";

import { usePathname, useRouter } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <form
      className="flex items-end gap-2 mb-8"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const queryTerm = formData.get("search") as string;
        router.push(pathname + "?search=" + queryTerm);
      }}
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="search">Search for users</Label>
        <Input id="search" name="search" type="text" placeholder="Enter name or email..." />
      </div>
      <Button type="submit" variant="default">
        Search
      </Button>
    </form>
  );
};