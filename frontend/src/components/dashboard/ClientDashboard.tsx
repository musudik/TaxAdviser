import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import taxFormService from '../../services/taxForm.service';
import { TaxForm } from '../../types/taxForm';

// Define a type for the API response
interface ApiResponse {
  [key: string]: any;
}

const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [taxForms, setTaxForms] = useState<TaxForm[]>([]);
  const [showSubmittedForms, setShowSubmittedForms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);

  useEffect(() => {
    // Only fetch forms if we're showing the submitted forms section and we have a user
    if (showSubmittedForms && user?.id) {
      fetchTaxForms();
    }
  }, [showSubmittedForms, user?.id]);

  const fetchTaxForms = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching tax forms for user ID:', user.id);
      const response = await taxFormService.getFormsByUserId(user.id);
      console.log('API Response:', JSON.stringify(response, null, 2));
      
      // Set debug data for troubleshooting
      setDebugData(response);
      
      let formsArray: TaxForm[] = [];
      
      // Handle various response formats
      if (Array.isArray(response)) {
        console.log('Response is an array');
        formsArray = response;
      } else if (response && typeof response === 'object') {
        console.log('Response is an object with structure:', Object.keys(response));
        // Try to extract forms from various possible response structures
        if (Array.isArray((response as ApiResponse).forms)) {
          formsArray = (response as ApiResponse).forms;
          console.log('Found forms array in response.forms');
        } else if (Array.isArray((response as ApiResponse).data)) {
          formsArray = (response as ApiResponse).data;
          console.log('Found forms array in response.data');
        } else if (Array.isArray((response as ApiResponse).taxForms)) {
          formsArray = (response as ApiResponse).taxForms;
          console.log('Found forms array in response.taxForms');
        }
      }
      
      // Filter for submitted forms
      console.log('Forms array before filtering:', formsArray);

      const submittedForms = formsArray;
      // const submittedForms = formsArray.filter(form => 
      //   form && typeof form === 'object' && form.status === 'submitted'
      // );
      console.log('Submitted forms after filtering:', submittedForms);
      
      setTaxForms(submittedForms);
      
      // Set error if no forms found
      if (formsArray.length === 0) {
        console.log('No forms found in response');
      }
      if (submittedForms.length === 0 && formsArray.length > 0) {
        console.log('Forms found but none with submitted status');
      }
    } catch (err) {
      console.error('Error fetching tax forms:', err);
      setError('Failed to load your submitted applications. Please try again later.');
      setTaxForms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubmittedForms = () => {
    setShowSubmittedForms(prev => !prev);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const reloadForms = () => {
    fetchTaxForms();
  };

  const toggleDebug = () => {
    setShowDebug(prev => !prev);
  };

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

          {/* Submitted Applications Card */}
          <div className="card rounded-lg border border-[#ddd6fe] bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-medium text-neutral-800 mb-4 font-['Switzer-Medium']">Submitted Applications</h2>
            <p className="text-neutral-600 font-['Switzer-Regular']">
              {taxForms.length > 0 
                ? `You have ${taxForms.length} submitted tax application(s).` 
                : 'No tax applications submitted yet.'}
            </p>
            <div className="mt-4">
              <button 
                className="auth-btn-secondary text-sm"
                onClick={toggleSubmittedForms}
              >
                {showSubmittedForms ? 'Hide Applications' : 'View Applications'}
              </button>
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

        {/* Submitted Applications List */}
        {showSubmittedForms && (
          <div className="mt-8 bg-white rounded-lg border border-[#ddd6fe] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-neutral-800 font-['Switzer-Medium']">Your Submitted Tax Applications</h2>
              <button 
                onClick={reloadForms}
                className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm flex items-center"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Reload Data'}
              </button>
            </div>
            
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <p className="text-gray-600">Loading your tax applications...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-medium">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <p className="mt-2 text-sm">Please try reloading the data using the button above.</p>
              </div>
            )}
            
            {!isLoading && !error && taxForms.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-gray-400 text-5xl mb-4">📄</div>
                <p className="text-neutral-600 mb-2">You haven't submitted any tax applications yet.</p>
                <p className="text-sm text-neutral-500">Submitted applications will appear here once they're processed.</p>
              </div>
            )}
            
            {!isLoading && !error && taxForms.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tax Year
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {taxForms.map((form) => (
                      <tr key={form.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {form.applicationId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {form.submissionYear || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            form.status === 'submitted' ? 'bg-green-100 text-green-800' :
                            form.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            form.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            form.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {form.status === 'submitted' ? 'Submitted' :
                             form.status === 'pending' ? 'Pending' :
                             form.status === 'rejected' ? 'Rejected' :
                             form.status === 'processing' ? 'Processing' :
                             form.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(form.submittedAt || '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/tax-form/view/${form.id}`} className="text-blue-600 hover:text-blue-900">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Debug Panel (only in development) */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button 
                onClick={toggleDebug} 
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
              >
                {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
              </button>
              
              {showDebug && (
                <div className="mt-2">
                  <h4 className="text-sm font-bold mb-1">API Response Debug Info:</h4>
                  <div className="bg-gray-100 p-3 rounded-md overflow-auto max-h-64 text-xs">
                    <pre>{debugData ? JSON.stringify(debugData, null, 2) : 'No data'}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard; 