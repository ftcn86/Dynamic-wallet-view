
"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { getTransactions } from '@/services/piService';
import type { Transaction } from '@/data/schemas';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight, Award, Server, CheckCircle, Clock, XCircle, Coins } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SortableTableHead, type SortConfig } from '@/components/shared/SortableTableHead';

type SortableKeys = 'date' | 'type' | 'amount' | 'status' | 'description';

const transactionTypeConfig = {
    sent: { icon: ArrowUpRight, color: 'text-red-500', label: "Sent" },
    received: { icon: ArrowDownLeft, color: 'text-green-500', label: "Received" },
    mining_reward: { icon: Award, color: 'text-yellow-500', label: "Mining Reward" },
    node_bonus: { icon: Server, color: 'text-blue-500', label: "Node Bonus" }
}

const statusConfig = {
    completed: { variant: 'success', icon: CheckCircle, text: "Completed" },
    pending: { variant: 'warning', icon: Clock, text: "Pending" },
    failed: { variant: 'destructive', icon: XCircle, text: "Failed" }
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const typeInfo = transactionTypeConfig[tx.type];
  const TypeIcon = typeInfo.icon;
  const statusInfo = statusConfig[tx.status];
  const StatusIcon = statusInfo.icon;

  return (
    <TableRow>
      <TableCell>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn("flex items-center justify-center h-8 w-8 rounded-full", typeInfo.color, 'bg-opacity-10', 'bg-current')}>
                        <TypeIcon className="h-4 w-4" />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{typeInfo.label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <div className="font-medium">{tx.description}</div>
        <div className="text-xs text-muted-foreground">{tx.id}</div>
      </TableCell>
      <TableCell className="text-right">
        <span className={cn("font-mono", tx.type === 'sent' || tx.type === 'received' ? typeInfo.color : 'text-foreground')}>
            {tx.type === 'sent' ? '-' : '+'}{tx.amount.toFixed(4)} π
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={statusInfo.variant} className="gap-1.5">
            <StatusIcon className="h-3.5 w-3.5" />
            {statusInfo.text}
        </Badge>
      </TableCell>
      <TableCell className="text-right text-muted-foreground">
        {format(new Date(tx.date), 'MMM dd, yyyy, hh:mm a')}
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
  const [sortConfig, setSortConfig] = useState<SortConfig<Transaction>>({ key: 'date', direction: 'descending' });

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
  }, []);

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
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];
        
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
            <Coins className="h-6 w-6 text-primary" />
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
                            <TableCell className="w-16">Type</TableCell>
                            <SortableTableHead<Transaction> sortKey="description" sortConfig={sortConfig} onClick={() => requestSort('description')}>
                                Details
                            </SortableTableHead>
                            <SortableTableHead<Transaction> sortKey="amount" sortConfig={sortConfig} onClick={() => requestSort('amount')} isNumeric>
                                Amount
                            </SortableTableHead>
                            <SortableTableHead<Transaction> sortKey="status" sortConfig={sortConfig} onClick={() => requestSort('status')}>
                                Status
                            </SortableTableHead>
                            <SortableTableHead<Transaction> sortKey="date" sortConfig={sortConfig} onClick={() => requestSort('date')} isNumeric>
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
