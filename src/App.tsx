import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Explore } from "./pages/Explore";
import { Subscriptions } from "./pages/Subscriptions";
import { Bookmarks } from "./pages/Bookmarks";
import { BlogPost } from "./pages/BlogPost";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { setAuthToken } from "./utils/api";

const queryClient = new QueryClient();

type Page =
  | "dashboard"
  | "login"
  | "explore"
  | "subscriptions"
  | "bookmarks"
  | "blog";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [blogPostId, setBlogPostId] = useState<string | null>(null);

  // Simple hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the #
      if (hash.startsWith("blog/")) {
        const postId = hash.split("/")[1];
        setCurrentPage("blog");
        setBlogPostId(postId);
      } else if (hash) {
        setCurrentPage(hash as Page);
      } else {
        setCurrentPage("dashboard");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (page: string, postId?: string) => {
    if (page === "blog" && postId) {
      setCurrentPage("blog");
      setBlogPostId(postId);
      window.location.hash = `blog/${postId}`;
    } else {
      setCurrentPage(page as Page);
      setBlogPostId(null);
      window.location.hash = page === "dashboard" ? "" : page;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login onNavigate={navigate} />;
      case "explore":
        return <Explore onNavigate={navigate} />;
      case "subscriptions":
        return <Subscriptions onNavigate={navigate} />;
      case "bookmarks":
        return <Bookmarks onNavigate={navigate} />;
      case "blog":
        return blogPostId ? (
          <BlogPost postId={blogPostId} onNavigate={navigate} />
        ) : (
          <Dashboard onNavigate={navigate} />
        );
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <TokenValidator />
          <div className="min-h-screen bg-gray-50">
            {currentPage !== "login" && (
              <Header currentPage={currentPage} onNavigate={navigate} />
            )}
            {renderPage()}
          </div>
        </AppProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

function TokenValidator() {
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkTokenValidity = () => {
      if (user) {
        try {
          // Check if the token is valid
          // This is a placeholder - replace with actual token validation logic
          const isTokenValid = validateFirebaseToken(user.token);

          if (!isTokenValid) {
            logout();
            setAuthToken("");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          logout();
        }
      }
    };

    checkTokenValidity();
  }, [user, logout]);

  return null;
}

function validateFirebaseToken(token: string): boolean {
  try {
    // Decode the token to get the expiration date
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();

    // Check if the token is expired
    return exp > now;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
}

export default App;
