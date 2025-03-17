import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';

export default function Dashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || !process.env.NEXT_PUBLIC_STRIPE_PRICE_ID) {
      alert('Payment system is not configured yet');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment service error');
      }

      const { sessionId } = await response.json();
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">Please sign in to access the dashboard</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {session.user?.name}</h1>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Upgrade to Pro'}
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add your dashboard widgets/cards here */}
      </main>
    </div>
  );
} 