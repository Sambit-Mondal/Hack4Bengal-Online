import { FC, useContext, useState } from 'react';
import { Search, Download, Plus, Filter } from 'lucide-react';
import { WalletContext } from '../contexts/WalletContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import { Alert } from '../components/ui/Alert';
import { Link } from 'react-router-dom';

interface LandRecord {
  id: string;
  owner: string;
  area: string;
  location: string;
  valuation: string;
  registeredDate: string;
}

// Sample data for the dashboard
const generateLandRecords = (count: number): LandRecord[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: (i + 1001).toString(),
    owner: '0x' + Math.random().toString(16).slice(2, 10) + '...',
    area: (Math.floor(Math.random() * 1000) + 100).toString(),
    location: 'HASH-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    valuation: (Math.floor(Math.random() * 1000000) + 50000).toString(),
    registeredDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
  }));
};

export const DashboardPage: FC = () => {
  const { connected } = useContext(WalletContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [landRecords] = useState<LandRecord[]>(generateLandRecords(10));
  
  const filteredRecords = landRecords.filter(record => 
    record.id.includes(searchTerm) || 
    record.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!connected) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Alert 
          variant="warning" 
          title="Access Denied"
          className="mb-6"
        >
          Please connect your wallet to access the dashboard.
        </Alert>
        <div className="text-center mt-4">
          <Button 
            as={Link}
            to="/"
            variant="primary"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-text-secondary">
            Manage and monitor all land records in the system
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            size="small"
            icon={<Filter className="h-4 w-4" />}
          >
            Filter
          </Button>
          <Button 
            variant="outline"
            size="small"
            icon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
          <Button 
            as={Link}
            to="/register"
            variant="primary"
            size="small"
            icon={<Plus className="h-4 w-4" />}
          >
            New Record
          </Button>
        </div>
      </div>
      
      <Card variant="default">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle>Land Registry Records</CardTitle>
            <div className="w-full md:w-64">
              <Input
                placeholder="Search by ID or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Land ID</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Area (sqm)</TableHead>
                <TableHead>Location Hash</TableHead>
                <TableHead>Valuation</TableHead>
                <TableHead>Registered Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.owner}</TableCell>
                    <TableCell>{record.area}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>${parseInt(record.valuation).toLocaleString()}</TableCell>
                    <TableCell>{record.registeredDate}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-text-secondary">
                    No records found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};