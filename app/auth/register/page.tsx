
'use client';

import AuthGuard from '../../../components/AuthGuard';
import RegisterForm from '../RegisterForm';

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <RegisterForm />
      </div>
    </AuthGuard>
  );
}
