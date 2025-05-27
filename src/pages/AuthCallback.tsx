
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed');
          navigate('/');
          return;
        }

        if (data.session) {
          // User is now confirmed and signed in
          toast.success('Your account has been confirmed! Welcome to KHRATE!');
          navigate('/');
        } else {
          // Check for hash fragments (email confirmation tokens)
          const hashFragment = window.location.hash;
          if (hashFragment) {
            const params = new URLSearchParams(hashFragment.substring(1));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            
            if (accessToken && refreshToken) {
              // Set the session manually
              const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (sessionError) {
                console.error('Session error:', sessionError);
                toast.error('Failed to confirm account');
                navigate('/');
                return;
              }
              
              if (sessionData.session) {
                toast.success('Your account has been confirmed! Welcome to KHRATE!');
                navigate('/');
                return;
              }
            }
          }
          
          // Fallback - redirect to home
          toast.info('Please log in to continue');
          navigate('/');
        }
      } catch (error) {
        console.error('Callback handling error:', error);
        toast.error('Something went wrong during confirmation');
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-khrate-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Confirming your account...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
