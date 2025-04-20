import { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, FileText, Search, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { WalletContext } from '../contexts/WalletContext';

export const HomePage: FC = () => {
  const { role } = useContext(WalletContext);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-6 h-[25rem] justify-center">
        <h1 className="text-4xl md:text-5xl font-bold max-w-3xl leading-tight flex items-center justify-center flex-col gap-4">
          Secure Land Registry on <span className=''><span className="text-primary-500">StarkNet</span> Blockchain</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          A transparent and immutable platform for registering, transferring and verifying land ownership. 
          Built for government officials, farmers, and landowners.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {(role === 'admin' || role === 'owner') && (
            <Link to="/register">
              <Button 
                variant="primary" 
                size="large"
                icon={<FileText className="h-5 w-5" />}
              >
                Register Land
              </Button>
            </Link>
          )}
          <Link to="/lookup">
            <Button 
              variant="outline" 
              size="large"
              icon={<Search className="h-5 w-5" />}
            >
              Lookup Property
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How LandChain Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card variant="hover" className="text-center">
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold">Register Property</h3>
              <p className="text-text-secondary">
                Add your land to the blockchain with an immutable record of ownership.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="hover" className="text-center">
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent-50 flex items-center justify-center">
                <Landmark className="h-8 w-8 text-accent-500" />
              </div>
              <h3 className="text-xl font-bold">Transfer Ownership</h3>
              <p className="text-text-secondary">
                Securely transfer land ownership with blockchain verification.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="hover" className="text-center">
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                <Search className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold">Verify Ownership</h3>
              <p className="text-text-secondary">
                Look up any property to verify ownership status instantly.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold">12,547+</div>
            <div className="text-primary-100 mt-2">Properties Registered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">4,320+</div>
            <div className="text-primary-100 mt-2">Transfers Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">156+</div>
            <div className="text-primary-100 mt-2">Counties Onboarded</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 text-center flex items-center justify-center flex-col">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
          Connect your wallet and start using the most secure land registry system on StarkNet blockchain.
        </p>
        <Link to="/lookup">
          <Button 
            variant="primary" 
            size="large"
            iconPosition="right"
            icon={<ArrowRight className="h-5 w-5" />}
          >
            Explore Land Records
          </Button>
        </Link>
      </section>
    </div>
  );
};