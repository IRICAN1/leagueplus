
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full my-2"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-blue-600 to-purple-700 text-transparent bg-clip-text">RaketLeague</h1>
          <p className="text-gray-600 text-center font-medium">Join our community of sports enthusiasts</p>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full my-2"></div>
        </div>
        
        <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
          <CardHeader className="space-y-1 pb-2 pt-6">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-700 to-blue-700 text-transparent bg-clip-text">Create an Account</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2 pb-6">
            <RegisterForm />
            
            <div className="flex items-center justify-center space-x-1 pt-2">
              <span className="text-sm text-gray-500">Already have an account?</span>
              <Link 
                to="/login" 
                className="text-sm font-semibold text-purple-600 hover:text-blue-600 transition-colors"
              >
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <div className="text-xs text-gray-400 text-center animate-pulse">
            Secure registration • Instant access • Join today
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
