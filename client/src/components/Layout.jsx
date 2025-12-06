import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    // CHANGE: Background updated to Light Mode Gradient (White/Blue)
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* Background Decor (Subtle Light Orbs) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-300/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col">
          {isAuthPage ? (
              // AUTH LAYOUT: Light Glass Card style
              <div className="flex-1 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl shadow-blue-900/5 animate-fade-in-up">
                      {children}
                  </div>
              </div>
          ) : (
              // APP LAYOUT: Full Width
              <main className="flex-1 w-full">
                  {children}
              </main>
          )}
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
            // CHANGE: Updated Toast Styles for Light Mode
            style: { 
                background: '#fff', 
                color: '#1e293b', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
            },
        }}
      />
    </div>
  );
};

export default Layout;