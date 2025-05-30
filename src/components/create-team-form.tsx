// "use client";
// import { Button } from "~/components/ui/button";
// import { Input } from "~/components/ui/input";
// import { Label } from "~/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "~/components/ui/dialog";
// import { createTeam } from "~/lib/team-builder-actions";
// import { Plus } from "lucide-react";
// import { useState } from "react";

// export function CreateTeamForm() {
//   const [open, setOpen] = useState(false);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <Plus className="mr-2 h-4 w-4" />
//           Create Team
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create New Team</DialogTitle>
//           <DialogDescription>
//             Give your Pokemon team a name to get started.
//           </DialogDescription>
//         </DialogHeader>
//         <form action={createTeam} className="space-y-4">
//           <div>
//             <Label htmlFor="teamName">Team Name</Label>
//             <Input
//               id="teamName"
//               name="teamName"
//               placeholder="Enter team name..."
//               required
//             />
//           </div>
//           <Button type="submit" className="w-full">
//             Create Team
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
