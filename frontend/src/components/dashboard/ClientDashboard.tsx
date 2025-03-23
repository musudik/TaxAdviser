import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-[#ddd6fe] bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-medium text-neutral-900 font-['Switzer-Medium']">Client Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600 font-['Switzer-Regular']">
              Welcome, {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={logout}
              className="auth-btn px-4 py-2 text-sm !bg-[#ff6384] hover:!bg-[#e63c6d]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tax Return Status Card */}
          <div className="card rounded-lg border border-[#ddd6fe] bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-medium text-neutral-800 mb-4 font-['Switzer-Medium']">Tax Return Status</h2>
            <p className="text-neutral-600 font-['Switzer-Regular']">No tax returns submitted yet.</p>
            <div className="mt-4">
              <Link to="/tax-return">
                <button className="auth-btn-secondary text-sm">Submit Tax Return</button>
              </Link>
            </div>
          </div>

          {/* Documents Card */}
          <div className="card rounded-lg border border-[#ddd6fe] bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-medium text-neutral-800 mb-4 font-['Switzer-Medium']">Documents</h2>
            <p className="text-neutral-600 font-['Switzer-Regular']">No documents uploaded yet.</p>
            <div className="mt-4">
              <button className="auth-btn-secondary text-sm">Upload Document</button>
            </div>
          </div>

          {/* Messages Card */}
          <div className="card rounded-lg border border-[#ddd6fe] bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-medium text-neutral-800 mb-4 font-['Switzer-Medium']">Messages</h2>
            <p className="text-neutral-600 font-['Switzer-Regular']">No new messages.</p>
            <div className="mt-4">
              <button className="auth-btn-secondary text-sm">View Messages</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard; 