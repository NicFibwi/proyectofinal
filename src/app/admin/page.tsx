import { redirect } from "next/navigation";
import { checkRole } from "~/utils/roles";
import { SearchUsers } from "./SearchUsers";
import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  getLatestSystemPrompt,
  setSystemPrompt,
} from "~/lib/team-builder-actions";
import { useUser } from "@clerk/nextjs";
import EditPromptForm from "~/app/admin/EditPromptForm";

// const handleSubmit = async (textAreaPrompt: string) => {
//   const userId = useUser().user?.id as string;
//   await setSystemPrompt(userId, textAreaPrompt);
// };

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  if (!(await checkRole("admin"))) {
    redirect("/");
  }

  const query = (await params.searchParams).search;

  const client = await clerkClient();

  const users = query ? (await client.users.getUserList({ query })).data : [];

  //   const [prompt, setPrompt] = useState("");

  //   useEffect(() => {
  //     getLatestSystemPrompt().then((promptText) => {
  //       setPrompt(promptText || "");
  //     });
  //   });

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Admin dashboard to manage users and AI assistant settings.
        </p>
      </div>
      <Card className="h-max w-full">
        <CardHeader>
          <SearchUsers />
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row">
          <div className="h-full md:w-1/2">
            {users.map((user) => {
              const primaryEmail = user.emailAddresses.find(
                (email) => email.id === user.primaryEmailAddressId,
              )?.emailAddress;

              return (
                <Card key={user.id} className="mb-6 w-full max-w-2xl">
                  <div className="flex flex-col items-start gap-6 p-6 md:flex-row">
                    <div className="flex min-w-[180px] flex-col justify-center">
                      <CardTitle>
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <div className="mt-2">
                        <Label>Email</Label>
                        <div className="text-muted-foreground">
                          {primaryEmail}
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label>Role</Label>
                        <div>{user.publicMetadata.role as string}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex w-full flex-col gap-2 md:mt-0 md:ml-auto md:w-auto">
                      <form action={setRole} className="flex gap-2">
                        <Input type="hidden" value={user.id} name="id" />
                        <Input type="hidden" value="admin" name="role" />
                        <Button type="submit" variant="secondary">
                          Make Admin
                        </Button>
                      </form>
                      <form action={removeRole} className="flex gap-2">
                        <Input type="hidden" value={user.id} name="id" />
                        <Button type="submit" variant="destructive">
                          Remove Role
                        </Button>
                      </form>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="h-full md:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant Prompt</CardTitle>
                <CardDescription>
                  Edit the prompt used by the AI assistant to generate
                  responses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditPromptForm />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
