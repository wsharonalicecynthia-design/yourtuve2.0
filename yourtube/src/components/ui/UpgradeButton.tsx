import { Button } from "@/components/ui/button";

// 1. Define the interface for the props
interface UpgradeButtonProps {
  planName: "Bronze" | "Silver" | "Gold"; // This restricts the prop to these specific values
}

export function UpgradeButton({ planName }: UpgradeButtonProps){
  const handleUpgrade = () => {
    console.log(`Upgrading to ${planName}...`);
    // Add your Razorpay or payment navigation logic here
  };

  return (
    <Button 
      variant="default" 
      onClick={handleUpgrade}
      className="bg-gradient-to-r from-yellow-400 to-orange-600"
    >
      Upgrade to {planName}
    </Button>
  );
}