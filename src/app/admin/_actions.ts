"use server";

import { checkRole } from "~/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";

export async function setRole(formData: FormData) {
  const client = await clerkClient();

  // Check that the user trying to set the role is an admin
  if (!(await checkRole("admin"))) {
    throw new Error("Not Authorized");
  }

  try {
    await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") },
      },
    );
  } catch (err) {
    throw err;
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient();

  try {
    await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: null },
      },
    );
  } catch (err) {
    throw err;
  }
}