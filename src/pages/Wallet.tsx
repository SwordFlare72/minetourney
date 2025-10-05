import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Loader2, Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Wallet() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const balance = useQuery(api.wallet.getBalance);
  const transactions = useQuery(api.wallet.getTransactions);
  const addFunds = useMutation(api.wallet.addFunds);
  const [amount, setAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleAddFunds = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await addFunds({ amount: numAmount });
      toast.success(`Added ${numAmount} coins to your wallet!`);
      setAmount("");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add funds");
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <WalletIcon className="h-8 w-8 text-green-500" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
                <p className="text-sm text-muted-foreground">Manage your coins</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="p-4 space-y-4">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">💰</span>
                    <span className="text-4xl font-bold tracking-tight">
                      {balance ?? 0}
                    </span>
                    <span className="text-xl text-muted-foreground">coins</span>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="cursor-pointer">
                        <Plus className="h-5 w-5 mr-2" />
                        Add Funds
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Funds</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          min="1"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          {[100, 500, 1000].map((preset) => (
                            <Button
                              key={preset}
                              variant="outline"
                              onClick={() => setAmount(preset.toString())}
                              className="cursor-pointer"
                            >
                              {preset}
                            </Button>
                          ))}
                        </div>
                        <Button
                          onClick={handleAddFunds}
                          className="w-full cursor-pointer"
                        >
                          Add Funds
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transactions */}
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-3">
              Recent Transactions
            </h2>
            <div className="space-y-2">
              {!transactions ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : transactions.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No transactions yet</p>
                  </CardContent>
                </Card>
              ) : (
                transactions.map((tx, index) => (
                  <motion.div
                    key={tx._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                tx.amount > 0
                                  ? "bg-green-500/10"
                                  : "bg-red-500/10"
                              }`}
                            >
                              {tx.amount > 0 ? (
                                <ArrowDownRight className="h-4 w-4 text-green-500" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {tx.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(tx._creationTime).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold ${
                                tx.amount > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {tx.amount > 0 ? "+" : ""}
                              {tx.amount}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
