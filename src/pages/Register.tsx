
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Trophy } from "lucide-react";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center space-y-2">
          <Trophy className="h-12 w-12 text-purple-600" />
          <h1 className="text-3xl font-bold text-purple-700">RaketLeague</h1>
          <p className="text-gray-500 text-center">Join our community of sports enthusiasts</p>
        </div>
        
        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RegisterForm />
            
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-purple-600 hover:text-purple-700 font-medium underline-offset-4 hover:underline"
              >
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
