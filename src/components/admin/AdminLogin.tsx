
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signIn, 
  checkStaffRole, 
  DEFAULT_ADMIN_EMAIL, 
  DEFAULT_ADMIN_PASSWORD,
  createDefaultAdminIfNeeded 
} from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Shield, Lock, Mail, AlertCircle, Info, Loader } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUsingDefault, setIsUsingDefault] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already logged in (now using localStorage)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionStr = localStorage.getItem('tulip_dental_auth_session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          
          if (session?.user) {
            // Check if user is admin
            const { role, error: roleError } = await checkStaffRole(session.user.id);
            
            if (!roleError && role === 'admin') {
              navigate('/admin');
            }
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
  }, [navigate]);

  const useDefaultCredentials = () => {
    setEmail(DEFAULT_ADMIN_EMAIL);
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setIsUsingDefault(true);
  };

  const createDefaultAdmin = async () => {
    setIsCreatingAdmin(true);
    setErrorMessage(null);
    
    try {
      // Clear any previous success state
      setCreationSuccess(false);
      
      const result = await createDefaultAdminIfNeeded();
      
      if (result.success) {
        setCreationSuccess(true);
        toast.success('Default admin created', {
          description: result.message,
        });
        
        // Set the credentials for easy login
        useDefaultCredentials();
      } else {
        setErrorMessage(`Failed to create default admin: ${result.error?.message || 'Unknown error'}`);
        toast.error('Failed to create default admin');
      }
    } catch (err: any) {
      console.error("Error creating default admin:", err);
      setErrorMessage(err.message || "An unexpected error occurred");
      toast.error('Failed to create default admin');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log("Attempting to sign in with:", email);
      const { data, error } = await signIn(email, password);

      if (error) {
        console.error("Auth error:", error);
        setErrorMessage(`Authentication failed: ${error.message}`);
        toast.error('Authentication failed', {
          description: error.message,
        });
        return;
      }

      if (!data.user) {
        setErrorMessage("No user returned from authentication");
        return;
      }

      // Check if the logged-in user is an admin
      console.log("Checking staff role for:", data.user.id);
      const { role, error: roleError, staffRecord } = await checkStaffRole(data.user.id);
      
      console.log("Role check result:", role, staffRecord);

      if (roleError) {
        console.error("Role check error:", roleError);
        setErrorMessage("Error verifying staff role: " + roleError.message);
        localStorage.removeItem('tulip_dental_auth_session');
        return;
      }

      if (role !== 'admin') {
        console.error("User is not an admin. Role:", role);
        setErrorMessage("You do not have admin privileges. Your role: " + (role || 'none'));
        localStorage.removeItem('tulip_dental_auth_session');
        return;
      }

      toast.success('Login Successful', {
        description: 'Redirecting to admin dashboard...',
      });
      navigate('/admin');
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setErrorMessage(err.message || "An unexpected error occurred");
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-tulip-dark-blue/10 text-tulip-dark-blue mb-4">
          <Shield className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">Admin Login</h2>
        <p className="text-gray-500 mt-2">Access the dental practice management system</p>
      </div>
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {creationSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Info className="h-4 w-4 text-green-500 mr-2" />
          <AlertDescription className="text-green-700">
            Default admin created successfully! You can now log in with the default credentials.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email
          </Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={DEFAULT_ADMIN_EMAIL}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Password
          </Label>
          <Input
            type="password"
            id="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" /> Logging in...
            </>
          ) : 'Login'}
        </Button>
        
        {!isUsingDefault && (
          <Button 
            type="button" 
            variant="outline" 
            className="w-full mt-2"
            onClick={useDefaultCredentials}
          >
            Use Default Admin Credentials
          </Button>
        )}
        
        <Button 
          type="button" 
          variant="secondary" 
          className="w-full mt-2"
          onClick={createDefaultAdmin}
          disabled={isCreatingAdmin}
        >
          {isCreatingAdmin ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" /> Creating Default Admin...
            </>
          ) : 'Create Default Admin Account'}
        </Button>
      </form>
      
      <Alert className="mt-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500 mr-2" />
        <AlertDescription className="text-sm">
          <strong>Default Admin Credentials:</strong><br/>
          Email: {DEFAULT_ADMIN_EMAIL}<br/>
          Password: {DEFAULT_ADMIN_PASSWORD}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdminLogin;
