
"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { getTransactions } from '@/services/piService';
import type { Transaction } from '@/data/schemas';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SortableTableHead } from '@/components/shared/SortableTableHead';
import { useAuth } from '@/contexts/AuthContext';

// Solid SVG Icons
const ArrowDownLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M17 7 7 17" stroke="#22c55e" strokeWidth="2" />
        <path d="M17 17H7V7" stroke="#22c55e" strokeWidth="2" />
    </svg>
);

const ArrowUpRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M7 17 17 7" stroke="#ef4444" strokeWidth="2" />
        <path d="M7 7h10v10" stroke="#ef4444" strokeWidth="2" />
    </svg>
);

const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b" {...props}>
        <circle cx="12" cy="8" r="7"/>
        <polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"/>
    </svg>
);

const ServerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" {...props}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" stroke="#fff" strokeWidth="2"/>
        <line x1="6" y1="18" x2="6.01" y2="18" stroke="#fff" strokeWidth="2"/>
    </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="currentColor"/>
      <polyline points="22 4 12 14.01 9 11.01" stroke="#fff" strokeWidth="2"/>
    </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
        <polyline points="12 6 12 12 16 14" stroke="#fff" strokeWidth="1.5" />
    </svg>
);

const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="#fff" strokeWidth="2" />
        <line x1="9" y1="9" x2="15" y2="15" stroke="#fff" strokeWidth="2" />
    </svg>
);

const CoinsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <circle cx="8" cy="8" r="6" />
        <path d="M18.09 10.72A6 6 0 1 1 10.72 18.09" />
        <path d="m14 6-3.1 3.1" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="m6 14 3.1-3.1" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M14 14.8V18" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M6 10.2V6" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
    </svg>
);

const ExternalLinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);


type SortableKeys = 'date' | 'type' | 'amount' | 'status' | 'description';

const transactionTypeConfig = {
    sent: { icon: ArrowUpRightIcon, colorClass: 'bg-red-500/10 text-red-500', label: "Sent" },
    received: { icon: ArrowDownLeftIcon, colorClass: 'bg-green-500/10 text-green-500', label: "Received" },
    mining_reward: { icon: AwardIcon, colorClass: 'bg-yellow-500/10 text-yellow-500', label: "Mining Reward" },
    node_bonus: { icon: ServerIcon, colorClass: 'bg-blue-500/10 text-blue-500', label: "Node Bonus" }
}

const statusConfig = {
    completed: { variant: 'success', icon: CheckCircleIcon, text: "Completed" },
    pending: { variant: 'warning', icon: ClockIcon, text: "Pending" },
    failed: { variant: 'destructive', icon: XCircleIcon, text: "Failed" }
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const typeInfo = transactionTypeConfig[tx.type];
  const TypeIcon = typeInfo.icon;
  const statusInfo = statusConfig[tx.status];
  const StatusIcon = statusInfo.icon;

  const handleExplorerRedirect = () => {
    // In a real app, this would use the tx.blockExplorerUrl
    console.log(`Redirecting to block explorer for tx: ${tx.id}`);
  };

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <AlertDialog>
          <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <div className={cn("flex items-center justify-center h-8 w-8 rounded-full cursor-pointer", typeInfo.colorClass)}>
                            <TypeIcon className="h-4 w-4" />
                        </div>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                      <p>View on Block Explorer</p>
                  </TooltipContent>
              </Tooltip>
          </TooltipProvider>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>View on Pi Block Explorer?</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to be redirected to an external block explorer to view the details of this transaction. Do you want to continue?
                <br /><br />
                <span className="text-xs text-muted-foreground truncate">Transaction ID: {tx.id}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleExplorerRedirect}>
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
      <TableCell>
        <div className="font-medium">{tx.description}</div>
        <div className="text-xs text-muted-foreground truncate hidden md:block">{tx.from || tx.to || 'Network'}</div>
      </TableCell>
      <TableCell className="text-right">
        <span className={cn("font-mono", {
          'text-red-600 dark:text-red-400': tx.type === 'sent',
          'text-green-600 dark:text-green-400': tx.type === 'received',
          'text-foreground': tx.type !== 'sent' && tx.type !== 'received'
        })}>
            {tx.type === 'sent' ? '-' : '+'}{tx.amount.toFixed(4)} π
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant={statusInfo.variant} className="gap-1.5">
            <StatusIcon className="h-3.5 w-3.5" />
            {statusInfo.text}
        </Badge>
      </TableCell>
      <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
        {format(new Date(tx.date), 'MMM dd, yyyy')}
      </TableCell>
    </TableRow>
  );
}


function TransactionsTableSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-md" />
      ))}
    </div>
  );
}


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<React.SortConfig<Transaction>>({ key: 'date', direction: 'descending' });
  const { dataVersion } = useAuth(); // Listen to data changes

  useEffect(() => {
    async function fetchTransactions() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (err) {
        setError("Failed to load transactions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, [dataVersion]); // Re-fetch when dataVersion changes

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = useMemo(() => {
    let sortableItems = [...transactions];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key as keyof Transaction];
        const valB = b[sortConfig.key as keyof Transaction];
        
        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else {
             const strA = String(valA ?? ''); 
             const strB = String(valB ?? '');
             comparison = strA.localeCompare(strB);
        }
        
        return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
      });
    }
    return sortableItems;
  }, [transactions, sortConfig]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Transaction History</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CoinsIcon className="h-6 w-6" />
            Your Ledger
          </CardTitle>
          <CardDescription>
            A complete history of all your transactions on the Pi Network.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <TransactionsTableSkeleton />}
          {!isLoading && error && <p className="text-destructive text-center py-8">{error}</p>}
          {!isLoading && !error && sortedTransactions.length === 0 && (
            <p className="text-muted-foreground text-center py-8">You have no transactions yet.</p>
          )}
          {!isLoading && !error && sortedTransactions.length > 0 && (
             <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="w-16 hidden sm:table-cell">Type</TableCell>
                            <SortableTableHead sortKey="description" sortConfig={sortConfig} onClick={() => requestSort('description')}>
                                Details
                            </SortableTableHead>
                            <SortableTableHead sortKey="amount" sortConfig={sortConfig} onClick={() => requestSort('amount')} isNumeric>
                                Amount
                            </SortableTableHead>
                            <SortableTableHead sortKey="status" sortConfig={sortConfig} onClick={() => requestSort('status')} className="hidden md:table-cell">
                                Status
                            </SortableTableHead>
                            <SortableTableHead sortKey="date" sortConfig={sortConfig} onClick={() => requestSort('date')} isNumeric className="hidden sm:table-cell">
                                Date
                            </SortableTableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTransactions.map((tx) => (
                            <TransactionRow key={tx.id} tx={tx} />
                        ))}
                    </TableBody>
                </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
