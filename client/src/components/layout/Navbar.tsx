import { FC, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Landmark, Menu, X, ExternalLink } from 'lucide-react';
import { WalletContext } from '../../contexts/WalletContext';
import { cn } from '../../utils/cn';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';

export const Navbar: FC = () => {
  const location = useLocation();
  const { connected, address, role, connect, disconnect } = useContext(WalletContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [showIdPrompt, setShowIdPrompt] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'owner' | null>(null);
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'Register Land', 
      path: '/register',
      role: 'admin'
    },
    { 
      name: 'Transfer Ownership', 
      path: '/transfer',
      role: 'owner'
    },
    { name: 'Land Lookup', path: '/lookup' },
    { 
      name: 'Dashboard', 
      path: '/dashboard',
      requiresAuth: true
    },
  ];

  const filteredNavLinks = navLinks.filter(link => {
    if (link.requiresAuth && !connected) return false;
    if (link.role && link.role !== role) return false;
    return true;
  });

  const handleRoleSelect = (role: 'admin' | 'owner') => {
    setSelectedRole(role);
    setShowRoleSelect(false);
    setShowIdPrompt(true);
    setError('');
  };

  const handleIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await connect(selectedRole!, id);
      setShowIdPrompt(false);
      setId('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid ID');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Landmark className="h-8 w-8 text-primary-500" />
            <span className="font-bold text-xl">LandChain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "text-primary-600 bg-primary-50"
                    : "text-text-secondary hover:text-primary-500 hover:bg-gray-50"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Wallet Connection Button */}
          <div className="hidden md:block relative">
            {connected ? (
              <button
                onClick={disconnect}
                className="btn-outline btn-small"
              >
                {role === 'admin' ? '👑 ' : '👤 '}
                {address}
                <ExternalLink className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowRoleSelect(!showRoleSelect)}
                  className="btn-primary btn-small"
                >
                  Connect Wallet
                </button>
                {showRoleSelect && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => handleRoleSelect('admin')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        👑 Login as Admin
                      </button>
                      <button
                        onClick={() => handleRoleSelect('owner')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        👤 Login as Owner
                      </button>
                    </div>
                  </div>
                )}
                {showIdPrompt && (
                  <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 p-4">
                    <form onSubmit={handleIdSubmit}>
                      <h3 className="text-lg font-medium mb-2">
                        {selectedRole === 'admin' ? 'Enter Admin ID' : 'Enter Owner ID'}
                      </h3>
                      {selectedRole === 'owner' && (
                        <p className="text-sm text-gray-500 mb-2">
                          Valid IDs: OWNER001, OWNER002, OWNER003
                        </p>
                      )}
                      <Input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder={selectedRole === 'admin' ? 'Admin ID' : 'Owner ID'}
                        className="mb-2"
                      />
                      {error && (
                        <Alert variant="error" className="mb-2">
                          {error}
                        </Alert>
                      )}
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowIdPrompt(false);
                            setId('');
                            setError('');
                          }}
                          className="btn-outline btn-small"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary btn-small"
                        >
                          Login
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-gray-500 hover:text-primary-500 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.path
                    ? "text-primary-600 bg-primary-50"
                    : "text-text-secondary hover:text-primary-500 hover:bg-gray-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {/* Mobile Wallet Button */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {connected ? (
                <button
                  onClick={disconnect}
                  className="w-full btn-outline"
                >
                  {role === 'admin' ? '👑 ' : '👤 '}
                  {address}
                  <ExternalLink className="h-4 w-4 ml-1" />
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className="w-full btn-primary"
                  >
                    👑 Login as Admin
                  </button>
                  <button
                    onClick={() => handleRoleSelect('owner')}
                    className="w-full btn-outline"
                  >
                    👤 Login as Owner
                  </button>
                </div>
              )}
              {showIdPrompt && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow">
                  <form onSubmit={handleIdSubmit}>
                    <h3 className="text-lg font-medium mb-2">
                      {selectedRole === 'admin' ? 'Enter Admin ID' : 'Enter Owner ID'}
                    </h3>
                    {selectedRole === 'owner' && (
                      <p className="text-sm text-gray-500 mb-2">
                        Valid IDs: OWNER001, OWNER002, OWNER003
                      </p>
                    )}
                    <Input
                      type="text"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      placeholder={selectedRole === 'admin' ? 'Admin ID' : 'Owner ID'}
                      className="mb-2"
                    />
                    {error && (
                      <Alert variant="error" className="mb-2">
                        {error}
                      </Alert>
                    )}
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowIdPrompt(false);
                          setId('');
                          setError('');
                        }}
                        className="btn-outline btn-small"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary btn-small"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};