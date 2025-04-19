import { FC, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { LandCard, LandRecord } from '../components/LandCard';

export const LookupPage: FC = () => {
  const [landId, setLandId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [landRecord, setLandRecord] = useState<LandRecord | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!landId.trim()) {
      setError('Please enter a Land ID');
      return;
    }

    setIsLoading(true);
    setError('');
    setLandRecord(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // If ID is 404, simulate not found
      if (landId === '404') {
        setError('Land record not found');
        return;
      }
      
      // Simulate found record
      setLandRecord({
        id: landId,
        owner: '0x7ac4F3F51e9c79532Abcd' + Math.floor(Math.random() * 10000),
        area: (Math.floor(Math.random() * 1000) + 100).toString(),
        location: 'HASH-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        valuation: (Math.floor(Math.random() * 1000000) + 50000).toString(),
        registeredDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1>Land Lookup</h1>
        <p className="text-text-secondary mt-2">
          Search for land ownership details by entering the Land ID
        </p>
      </div>

      <Card variant="hover" className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Search Land Records</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <Input
              label="Land ID"
              name="landId"
              value={landId}
              onChange={(e) => {
                setLandId(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter Land ID to search"
              icon={<Search className="h-5 w-5" />}
              error={error}
              required
            />
            <Button 
              type="submit" 
              variant="primary"
              isLoading={isLoading}
              fullWidth
            >
              Lookup Land Record
            </Button>
          </form>
        </CardContent>
      </Card>

      {landRecord && (
        <div className="animate-in mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Land Record Details</h2>
          <div className="max-w-md mx-auto">
            <LandCard land={landRecord} />
          </div>
        </div>
      )}
    </div>
  );
};