import React from 'react';
import { QRGenerator } from './components/QRGenerator';

function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-slate-100 to-indigo-200">
      
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[100px]" />
      </div>

      <QRGenerator />
      
    </div>
  );
}

export default App;