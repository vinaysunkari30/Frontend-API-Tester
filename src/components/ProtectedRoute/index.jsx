import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      // const { error } = await supabase.auth.refreshSession();
      // if (error) await supabase.auth.signOut();
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return session ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
