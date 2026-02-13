import { useEffect } from 'react';

const AdminTest = () => {
  useEffect(() => {
    console.log('✅ Admin route is working! Redirecting to login...');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="text-green-600 text-4xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-800 mb-2">Admin Route Working!</h1>
        <p className="text-gray-600 mb-4">Successfully accessed /admin route</p>
        <p className="text-sm text-gray-500">Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default AdminTest;