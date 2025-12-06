import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth'; // Import the function we just made
import toast from 'react-hot-toast';
import { User, Lock, Loader2 } from 'lucide-react'; // Icons

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // THE MAGIC: TanStack Query Mutation
  // This handles isLoading, isError, and onSuccess for us!
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(`Welcome back, ${data.name}!`);
      // We will redirect to dashboard in Phase 4. For now:
      navigate('/dashboard'); 
    },
    onError: (error) => {
      // Axios stores the error message in error.response.data.message
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password }); // Trigger the API call
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        TaskFlow Ultra
      </h1>
      <p className="text-gray-500 mb-8">Login to continue your streak!</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        
        {/* Email Field */}
        <div className="relative group">
          <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="relative group">
          <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Action Button with Loading State */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {mutation.isPending ? <Loader2 className="animate-spin" /> : "Level Up (Login)"}
        </button>

      </form>

      <div className="mt-6 text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-purple-600 font-bold hover:underline">
          Join the Guild
        </Link>
      </div>
    </div>
  );
};

export default Login;