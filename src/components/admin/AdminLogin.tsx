
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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
        const { data: adminData, error: adminError } = await supabaseClient
          .from('staff')
          .select('role')
          .eq('auth_id', data.user.id)
          .single();

        if (adminError || !adminData || adminData.role !== 'admin') {
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
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
