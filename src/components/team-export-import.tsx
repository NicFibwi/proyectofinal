"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Download, Upload, Copy, Check } from "lucide-react";
import { exportTeam, importTeam } from "~/lib/team-export-import-actions";
import { useRouter } from "next/navigation";

interface TeamExportImportProps {
  teamId: number;
  userId: string;
  teamName: string;
  onTeamImported?: () => void;
}

/**
 * @deprecated Use TeamExport and TeamImport components instead.
 */
export default function TeamExportImport({
  teamId,
  userId,
  teamName,
  onTeamImported,
}: TeamExportImportProps) {
  const [exportData, setExportData] = useState("");
  const [importData, setImportData] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const router = useRouter();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportTeam(teamId, userId);
      setExportData(data);
      window.alert(
        "Team exported successfully!\nYou can now copy and share this team data.",
      );
    } catch (error) {
      window.alert("Export failed.\nFailed to export team. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      window.alert("No data provided.\nPlease paste the team data to import.");
      return;
    }

    setIsImporting(true);
    try {
      const newTeamId = await importTeam(importData, userId, newTeamName);
      window.alert(
        "Team imported successfully!\nThe team has been added to your collection.",
      );
      setImportDialogOpen(false);
      setImportData("");
      setNewTeamName("");

      router.push(`/team/${newTeamId}`);
      onTeamImported?.();
    } catch (error) {
      window.alert(
        "Import failed.\nFailed to import team. Please check the data format.",
      );
    } finally {
      setIsImporting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      setIsCopied(true);
      window.alert(
        "Copied to clipboard!\nTeam data has been copied to your clipboard.",
      );
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      window.alert(
        "Copy failed.\nFailed to copy to clipboard. Please copy manually.",
      );
    }
  };

  return (
    <div className="flex gap-2">
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Export Team
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Export Team: {teamName}</DialogTitle>
            <DialogDescription>
              Export your team data to share with other players. They can import
              this data to get an exact copy of your team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!exportData ? (
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full"
              >
                {isExporting ? "Exporting..." : "Generate Export Data"}
              </Button>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="export-data">
                  Team Data (Copy and share this):
                </Label>
                <div className="relative">
                  <Textarea
                    id="export-data"
                    value={exportData}
                    readOnly
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={copyToClipboard}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Import Team
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Team</DialogTitle>
            <DialogDescription>
              Paste team data from another player to import their team into your
              collection.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-team-name">Team Name (optional)</Label>
              <Input
                id="new-team-name"
                placeholder="Leave empty to use original name with '(Imported)' suffix"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="import-data">Team Data:</Label>
              <Textarea
                id="import-data"
                placeholder="Paste the exported team data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleImport}
              disabled={isImporting || !importData.trim()}
            >
              {isImporting ? "Importing..." : "Import Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function TeamImport({
  userId,
  onTeamImported,
}: {
  userId: string;
  onTeamImported?: () => void;
}) {
  const [importData, setImportData] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const handleImport = async () => {
    if (!importData.trim()) {
      window.alert("No data provided.\nPlease paste the team data to import.");
      return;
    }

    setIsImporting(true);
    try {
      const newTeamId = await importTeam(importData, userId, newTeamName);
      window.alert(
        "Team imported successfully!\nThe team has been added to your collection.",
      );
      setImportDialogOpen(false);
      setImportData("");
      setNewTeamName("");
      onTeamImported?.();
    } catch (error) {
      window.alert(
        "Import failed.\nFailed to import team. Please check the data format.",
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Import Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Team</DialogTitle>
          <DialogDescription>
            Paste team data from another player to import their team into your
            collection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-team-name">Team Name (optional)</Label>
            <Input
              id="new-team-name"
              placeholder="Leave empty to use original name with '(Imported)' suffix"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="import-data">Team Data:</Label>
            <Textarea
              id="import-data"
              placeholder="Paste the exported team data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleImport}
            disabled={isImporting || !importData.trim()}
          >
            {isImporting ? "Importing..." : "Import Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TeamExport({
  teamId,
  userId,
  teamName,
}: {
  teamId: number;
  userId: string;
  teamName: string;
}) {
  const [exportData, setExportData] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportTeam(teamId, userId);
      setExportData(data);
      window.alert(
        "Team exported successfully!\nYou can now copy and share this team data.",
      );
    } catch (error) {
      window.alert("Export failed.\nFailed to export team. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      setIsCopied(true);
      window.alert(
        "Copied to clipboard!\nTeam data has been copied to your clipboard.",
      );
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      window.alert(
        "Copy failed.\nFailed to copy to clipboard. Please copy manually.",
      );
    }
  };

  return (
    <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Export Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Team: {teamName}</DialogTitle>
          <DialogDescription>
            Export your team data to share with other players. They can import
            this data to get an exact copy of your team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!exportData ? (
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? "Exporting..." : "Generate Export Data"}
            </Button>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="export-data">
                Team Data (Copy and share this):
              </Label>
              <div className="relative">
                <Textarea
                  id="export-data"
                  value={exportData}
                  readOnly
                  className="min-h-[200px] font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={copyToClipboard}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
