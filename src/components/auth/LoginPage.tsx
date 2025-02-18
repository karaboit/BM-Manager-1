import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  React.useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the boarding house management system
          </p>
        </div>
        <Button className="w-full" onClick={() => loginWithRedirect()}>
          Sign In
        </Button>
      </div>
    </div>
  );
}
