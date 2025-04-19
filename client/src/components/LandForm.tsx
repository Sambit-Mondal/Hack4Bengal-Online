import { FC, useEffect, useState } from 'react';
import { MapPin, Hash, User, Ruler, DollarSign, Mail } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';

interface LandFormProps {
  type: 'register' | 'transfer';
  onSubmit?: (data: Record<string, string>) => void;
  isLoading?: boolean;
}

export const LandForm: FC<LandFormProps> = ({ type, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    ownerName: '',
    ownerEmail: '',
    landId: '',
    ownerAddress: '',
    area: '',
    locationHash: '',
    valuation: '',
    newOwnerAddress: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  useEffect(() => {
    // This ensures that form fields reset when formData changes
  }, [formData]);

  return (
    <Card variant="hover" className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>
            {type === 'register' ? 'Register Land Property' : 'Transfer Land Ownership'}
          </CardTitle>
          <CardDescription>
            {type === 'register'
              ? 'Fill in the details to register a new land property on the blockchain'
              : 'Transfer land ownership to a new address securely'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {type === 'register' && (
            <Input
              label="Owner's Name"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Enter the owner's name"
              icon={<User className="h-5 w-5" />}
            />
          )}

          <Input
            label="Owner's Email ID"
            name="ownerEmail"
            value={formData.ownerEmail}
            onChange={handleChange}
            placeholder="Enter the owner's email address"
            icon={<Mail className="h-5 w-5" />}
          />

          <Input
            label="Land ID"
            name="landId"
            value={formData.landId}
            onChange={handleChange}
            placeholder="Enter unique land identifier"
            icon={<Hash className="h-5 w-5" />}
          />

          <Input
            label="Current Owner Address"
            name="ownerAddress"
            value={formData.ownerAddress}
            onChange={handleChange}
            placeholder="Enter blockchain address of owner"
            icon={<User className="h-5 w-5" />}
          />

          {type === 'register' && (
            <>
              <Input
                label="Area (in sq. meters)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                placeholder="Land area in square meters"
                icon={<Ruler className="h-5 w-5" />}
              />
              <Input
                label="Location Hash"
                name="locationHash"
                value={formData.locationHash}
                onChange={handleChange}
                placeholder="Geolocation hash"
                icon={<MapPin className="h-5 w-5" />}
              />
              <Input
                label="Valuation (in USD)"
                name="valuation"
                type="number"
                value={formData.valuation}
                onChange={handleChange}
                placeholder="Property valuation"
                icon={<DollarSign className="h-5 w-5" />}
              />
            </>
          )}

          {type === 'transfer' && (
            <Input
              label="New Owner Address"
              name="newOwnerAddress"
              value={formData.newOwnerAddress}
              onChange={handleChange}
              placeholder="Enter blockchain address of new owner"
              icon={<User className="h-5 w-5" />}
            />
          )}
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            variant={type === 'register' ? 'primary' : 'accent'}
            isLoading={isLoading}
            fullWidth
          >
            {type === 'register' ? 'Register Land' : 'Transfer Ownership'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};