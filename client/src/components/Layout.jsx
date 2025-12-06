import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Pages that should look like a "Card" (Login/Register)
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col">
          {isAuthPage ? (
              // AUTH LAYOUT: Centered Card
              <div className="flex-1 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-fade-in-up">
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
            style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
        }}
      />
    </div>
  );
};

export default Layout;