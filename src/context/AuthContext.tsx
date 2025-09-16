import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  getIdToken,
} from "firebase/auth";
import { app } from "../firebase"; // Ensure you have a firebase.js file exporting your firebase app
import { AuthContextType, User } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { setAuthToken } from "../utils/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>("rss_reader_user", null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const token = await getIdToken(user);
      setAuthToken(token);
      if (user) {
        const newUser: User = {
          id: user.uid,
          email: user.email || "",
          displayName: user.displayName || email.split("@")[0],
          token,
        };
        setUser(newUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    const auth = getAuth(app);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await getIdToken(userCredential.user);
      setAuthToken(token);
      const newUser: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || "",
        displayName: userCredential.user.displayName || email.split("@")[0],
        token,
      };
      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch (error: Error) {
      setIsLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(auth.currentUser!);
      setAuthToken(token);
      const newUser: User = {
        id: auth.currentUser?.uid || "",
        email: auth.currentUser?.email || "",
        displayName: auth.currentUser?.displayName || email.split("@")[0],
        token,
      };
      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch (error: Error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
