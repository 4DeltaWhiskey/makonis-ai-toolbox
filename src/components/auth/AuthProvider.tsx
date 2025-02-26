
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAdmin: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          checkAdminStatus(initialSession.user.id);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.email);
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        checkAdminStatus(currentSession.user.id);
      } else {
        setIsAdmin(false);
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        user_id: userId,
        role: 'admin'
      });
      
      if (error) {
        console.error("Failed to check admin status:", error);
        return;
      }
      
      setIsAdmin(data);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local state
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      // Navigate to auth page
      navigate('/auth');
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "Failed to sign out",
      });
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
