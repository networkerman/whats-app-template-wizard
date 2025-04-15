import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTemplate } from "@/contexts/TemplateContext";
import { formatDate } from "@/utils/templateUtils";
import { AlertCircle, CheckCircle2, Clock, History, Info } from "lucide-react";

const ApprovalWorkflow = () => {
  const { template, approveTemplate, getActiveCampaigns } = useTemplate();
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showCampaignWarning, setShowCampaignWarning] = useState(false);
  const [activeCampaigns, setActiveCampaigns] = useState<string[]>([]);

  const handleApprove = async () => {
    try {
      if (template.status === "live") {
        const campaigns = getActiveCampaigns();
        if (campaigns.length > 0) {
          setActiveCampaigns(campaigns);
          setShowCampaignWarning(true);
          return;
        }
      }
      
      await approveTemplate();
      setShowApprovalDialog(false);
    } catch (error) {
      console.error("Failed to approve template:", error);
    }
  };

  const handleCampaignWarningConfirm = async () => {
    setShowCampaignWarning(false);
    await approveTemplate();
    setShowApprovalDialog(false);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {template.status === "draft" && <Clock className="w-4 h-4 text-amber-500" />}
            {template.status === "approved" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {template.status === "live" && <History className="w-4 h-4 text-blue-500" />}
            <span className="font-medium">
              {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApprovalDialog(true)}
            disabled={template.status === "live"}
          >
            Approve Template
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Version: {template.version}</p>
          <p>Last edited: {formatDate(template.lastEdited)}</p>
        </div>
      </Card>

      {template.status === "live" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This template is currently live. Any changes will affect active campaigns.
            Templates can only be edited once every 24 hours when live.
          </AlertDescription>
        </Alert>
      )}

      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this template? This will make it available for use in campaigns.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Template Details</p>
                <p className="text-sm text-gray-500">Name: {template.name}</p>
                <p className="text-sm text-gray-500">Category: {template.category}</p>
                <p className="text-sm text-gray-500">Language: {template.language}</p>
              </div>
            </div>
            
            {template.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the following errors before approving:
                  <ul className="list-disc pl-5 mt-2">
                    {template.errors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={template.errors.length > 0}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCampaignWarning} onOpenChange={setShowCampaignWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Active Campaigns Warning</DialogTitle>
            <DialogDescription>
              The following campaigns are currently using this template:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            {activeCampaigns.map((campaign, index) => (
              <div key={index} className="text-sm">
                • {campaign}
              </div>
            ))}
          </div>
          
          <p className="text-sm text-amber-600 mt-4">
            Approving this template will affect these campaigns. Do you want to proceed?
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCampaignWarning(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCampaignWarningConfirm}>
              Approve Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalWorkflow; 