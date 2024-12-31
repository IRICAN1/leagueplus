import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm, LoginFormValues } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { signIn, isLoading } = useAuth();

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm onSubmit={signIn} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;