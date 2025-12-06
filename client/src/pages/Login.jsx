import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import toast from 'react-hot-toast';
import { User, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/dashboard'); 
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Brand Header */}
      <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
        TaskFlow Ultra
      </h1>
      <p className="text-slate-500 font-medium mb-8">Sign in to manage your productivity.</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-5">
        
        {/* Email Field - Clean White Style */}
        <div className="relative group">
          <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field - Clean White Style */}
        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Action Button - Corporate Blue */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-95"
        >
          {mutation.isPending ? <Loader2 className="animate-spin" /> : "Sign In"}
          {!mutation.isPending && <ArrowRight size={20} />}
        </button>

      </form>

      {/* Footer Link */}
      <div className="mt-8 text-sm text-slate-500 font-medium">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Login;