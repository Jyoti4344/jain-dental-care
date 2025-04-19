
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient, signIn, checkStaffRole } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      
      if (data.session) {
        // Check if user is admin
        const { role, error: roleError } = await checkStaffRole(data.session.user.id);
        
        if (!roleError && role === 'admin') {
          navigate('/admin');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log("Attempting to sign in with:", email);
      const { data, error } = await signIn(email, password);

      if (error) {
        console.error("Auth error:", error);
        setErrorMessage(error.message);
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
        await supabaseClient.auth.signOut();
        return;
      }

      if (role !== 'admin') {
        console.error("User is not an admin. Role:", role);
        setErrorMessage("You do not have admin privileges. Your role: " + role);
        await supabaseClient.auth.signOut();
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
            placeholder="admin@example.com"
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
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <Alert className="mt-6">
        <AlertDescription className="text-sm">
          <strong>Note:</strong> Make sure you have created a staff member with role='admin' in your Supabase database 
          and linked it to an authenticated user.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdminLogin;
