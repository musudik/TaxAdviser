import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-destructive rounded-md hover:bg-destructive/90"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tax Return Status Card */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Tax Return Status</h2>
            <p className="text-muted-foreground">No tax returns submitted yet.</p>
          </div>

          {/* Documents Card */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            <p className="text-muted-foreground">No documents uploaded yet.</p>
          </div>

          {/* Messages Card */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Messages</h2>
            <p className="text-muted-foreground">No new messages.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard; 