import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { paymentsAPI } from '../services/api';

const stripePromise = loadStripe('pk_test_51OqGJcKZvKxjHnNn0123456789abcdefghijklmnopqrstuvwxyz');

const CheckoutForm = ({ course, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [requiresAction, setRequiresAction] = useState(false);
  const [processing, setProcessing] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    setProcessing('Creating secure payment...');
    
    try {
      // Create payment method first
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Customer Name',
        },
      });

      if (pmError) {
        onError(pmError.message);
        setLoading(false);
        return;
      }

      setPaymentMethod(paymentMethod);
      setProcessing('Verifying payment details...');

      // Create payment intent with 3D Secure
      const { data } = await paymentsAPI.createPaymentIntent(course.id, course.price);
      
      setProcessing('Processing payment...');
      
      // Confirm payment with 3D Secure authentication
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: paymentMethod.id,
        setup_future_usage: 'off_session'
      });

      if (result.error) {
        if (result.error.code === 'authentication_required') {
          setRequiresAction(true);
          setProcessing('Authentication required. Please complete verification...');
          
          // Handle 3D Secure authentication
          const { error: authError } = await stripe.confirmCardPayment(data.clientSecret);
          
          if (authError) {
            onError('Authentication failed: ' + authError.message);
          } else {
            setProcessing('Payment authenticated successfully!');
            await paymentsAPI.confirmPayment(result.paymentIntent.id, course.id);
            onSuccess();
          }
        } else {
          onError(result.error.message);
        }
      } else {
        setProcessing('Payment successful!');
        // Payment succeeded, confirm with backend
        await paymentsAPI.confirmPayment(result.paymentIntent.id, course.id);
        onSuccess();
      }
    } catch (error) {
      onError(error.response?.data?.error || 'Payment failed');
    }
    
    setLoading(false);
    setRequiresAction(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-summary">
        <h3>{course.title}</h3>
        <p className="price">${course.price}</p>
      </div>
      
      <div className="security-badges">
        <div className="badge">🔒 SSL Encrypted</div>
        <div className="badge">🛡️ 3D Secure</div>
        <div className="badge">💳 PCI Compliant</div>
      </div>
      
      <div className="card-element">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      {processing && (
        <div className="processing-status">
          <div className="spinner"></div>
          <span>{processing}</span>
        </div>
      )}
      
      {requiresAction && (
        <div className="auth-notice">
          🔐 Additional authentication required by your bank for security
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="payment-button"
      >
        {loading ? 'Processing...' : `🔒 Secure Pay $${course.price}`}
      </button>
      
      <div className="trust-indicators">
        <p>✅ 256-bit SSL encryption</p>
        <p>✅ Your card details are never stored</p>
        <p>✅ Powered by Stripe - trusted by millions</p>
      </div>
    </form>
  );
};

const PaymentForm = ({ course, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        course={course} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  );
};

export default PaymentForm;