import { FC } from 'react';
import { MapPin, User, Calendar, DollarSign, Ruler } from 'lucide-react';
import { Card, CardContent } from './ui/Card';

export interface LandRecord {
  id: string;
  owner: string;
  area: string;
  location: string;
  valuation: string;
  registeredDate: string;
}

interface LandCardProps {
  land: LandRecord;
}

export const LandCard: FC<LandCardProps> = ({ land }) => {
  return (
    <Card variant="hover" className="h-full">
      <CardContent>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Land #{land.id}</h3>
          <span className="badge-primary">Verified</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-text-secondary" />
            <span className="text-text-secondary">Owner:</span>
            <span className="ml-2 font-medium text-text-primary overflow-hidden text-ellipsis">{land.owner}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Ruler className="h-4 w-4 mr-2 text-text-secondary" />
            <span className="text-text-secondary">Area:</span>
            <span className="ml-2 font-medium text-text-primary">{land.area} sq. meters</span>
          </div>
          
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-text-secondary" />
            <span className="text-text-secondary">Location:</span>
            <span className="ml-2 font-medium text-text-primary">{land.location}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-2 text-text-secondary" />
            <span className="text-text-secondary">Valuation:</span>
            <span className="ml-2 font-medium text-text-primary">${parseInt(land.valuation).toLocaleString()}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-text-secondary" />
            <span className="text-text-secondary">Registered:</span>
            <span className="ml-2 font-medium text-text-primary">{land.registeredDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};