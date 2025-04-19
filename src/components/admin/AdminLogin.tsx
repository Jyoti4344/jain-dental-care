
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient, checkStaffRole } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Shield, Lock, Mail } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Login failed', {
          description: error.message,
        });
        return;
      }

      // Check if the logged-in user is an admin
      if (data.user) {
        const { role, error: roleError } = await checkStaffRole(data.user.id);

        if (roleError || role !== 'admin') {
          await supabaseClient.auth.signOut();
          toast.error('Access Denied', {
            description: 'You do not have admin privileges.',
          });
          return;
        }

        toast.success('Login Successful', {
          description: 'Redirecting to admin dashboard...',
        });
        navigate('/admin');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
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
          <strong>Demo Login:</strong> Use the admin account created in your Supabase Auth.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdminLogin;
