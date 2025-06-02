"use client";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import {
  getTeams,
  createTeam,
  addUser,
  deleteTeam,
  updateTeam,
} from "~/lib/team-builder-actions";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { TeamImport } from "~/components/team-export-import";

export default function TeamBuilderPage() {
  const { user } = useUser();
  const [teams, setTeams] = useState<
    { team_id: number; user_id: string; team_name: string }[]
  >([]);
  const [teamName, setTeamName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editingTeamName, setEditingTeamName] = useState("");

  useEffect(() => {
    if (user) {
      addUser(user.id, user.fullName as string);
      getTeams(user.id).then(setTeams);
    }
  }, [user]);

  const handleCreateTeam = async () => {
    if (teamName.trim()) {
      await createTeam(user!.id, teamName);
      setTeamName("");
      const updatedTeams = await getTeams(user!.id);
      setTeams(updatedTeams);
    }
  };

  const refreshTeams = async () => {
    if (user) {
      const updatedTeams = await getTeams(user.id);
      setTeams(updatedTeams);
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Team Builder</h1>
        <p className="text-muted-foreground">
          Pokémon team creator and editor with advanced customization
        </p>
      </div>

      <SignedOut>
        <div className="flex h-auto w-full items-center justify-center">
          <Card className="h-auto w-65 shadow-xl">
            <CardHeader>
              <CardTitle className="text-md font-bold">Team builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                To access the team builder, please sign in to your account.
              </div>
              <div>
                If you don&apos;t have an account, you can create one for free.
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <SignInButton></SignInButton>
            </CardFooter>
          </Card>
        </div>
      </SignedOut>

      <SignedIn>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-md font-bold">Your Teams</CardTitle>
                <CardDescription>
                  Here are your saved Pokémon teams.
                </CardDescription>
              </div>
              {user && (
                <TeamImport userId={user.id} onTeamImported={refreshTeams} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-1 flex-row items-center">
                  <Label className="mr-2">Team Name:</Label>
                  <Input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Team Name"
                    className="mr-2 w-full rounded border px-2 py-1"
                  />
                  <Button onClick={handleCreateTeam} className="p-2 sm:p-3">
                    <span className="hidden lg:inline">Create team</span>
                    <span className="lg:hidden">
                      <Plus className="h-4 w-4" />
                    </span>
                  </Button>
                </div>
              </div>

              {teams.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {teams.map((team) => (
                    <Card
                      key={team.team_id}
                      className="flex w-full flex-row items-center justify-between rounded-lg border p-4"
                    >
                      <Link
                        href={`/team-builder/${team.team_id}`}
                        className="w-full text-lg font-semibold hover:underline"
                      >
                        <div className="flex w-full flex-row">
                          {team.team_name}
                        </div>
                      </Link>
                      <div className="flex w-1/3 flex-row items-center justify-around">
                        <Button
                          className="bg-red-500"
                          onClick={async () => {
                            await deleteTeam(team.team_id);
                            const updatedTeams = await getTeams(user!.id);
                            setTeams(updatedTeams);
                          }}
                        >
                          <Trash2 />
                        </Button>

                        <Button
                          className="bg-blue-400"
                          onClick={() => {
                            setEditingTeamId(team.team_id);
                            setEditingTeamName(team.team_name);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil />
                        </Button>
                      </div>
                      {/* Dialog for editing team name */}
                      <Dialog
                        open={isDialogOpen && editingTeamId === team.team_id}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Team Name</DialogTitle>
                          </DialogHeader>
                          <Input
                            type="text"
                            value={editingTeamName}
                            onChange={(e) => setEditingTeamName(e.target.value)}
                            placeholder="New Team Name"
                            className="mb-4 w-full rounded border px-2 py-1"
                          />
                          <DialogFooter className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-blue-500"
                              onClick={async () => {
                                if (editingTeamName.trim()) {
                                  await updateTeam(
                                    editingTeamId!,
                                    editingTeamName,
                                  );
                                  const updatedTeams = await getTeams(user!.id);
                                  setTeams(updatedTeams);
                                  setIsDialogOpen(false);
                                }
                              }}
                            >
                              Submit
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No teams found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </SignedIn>
    </div>
  );
}
