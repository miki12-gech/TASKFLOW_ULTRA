import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth'; // Ensure this matches the import
import toast from 'react-hot-toast';
import { User, Mail, Lock, Loader2, Sparkles } from 'lucide-react'; // Added Sparkles for flair

const Register = () => {
  const [name, setName] = useState(''); // New State for Name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // The Register Mutation
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(`Account created! Welcome, ${data.name}!`);
      navigate('/dashboard'); // Go to Dashboard on success
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send all three fields to backend
    mutation.mutate({ name, email, password });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2">
         <Sparkles className="text-yellow-500" />
         <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            New Account
         </h1>
      </div>
      <p className="text-gray-500 mb-8">Begin your productivity journey.</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        
        {/* Name Field (New) */}
        <div className="relative group">
          <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Hero Name"
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email Field */}
        <div className="relative group">
          <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
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
            placeholder="Secret Password"
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {mutation.isPending ? <Loader2 className="animate-spin" /> : "Start Adventure"}
        </button>

      </form>

      <div className="mt-6 text-sm text-gray-500">
        Already a member?{' '}
        <Link to="/login" className="text-purple-600 font-bold hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Register;