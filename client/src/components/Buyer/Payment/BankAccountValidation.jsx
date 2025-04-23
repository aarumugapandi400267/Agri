import React, { useState } from 'react';
import axios from 'axios';

const AccountVerification = ({ onVerificationSuccess }) => {
  const [accountDetails, setAccountDetails] = useState({
    name: '',
    ifsc: '',
    accountNumber: ''
  });
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const verifyAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/account/verify',
        accountDetails,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data.valid) {
        setVerificationResult({
          success: true,
          message: 'Account verified successfully!',
        });
        if (onVerificationSuccess && typeof onVerificationSuccess === 'function') {
          onVerificationSuccess(response.data.data);
        } else {
          console.error('onVerificationSuccess is not a function');
        }
      } else {
        setVerificationResult({
          success: false,
          message: response.data.message || 'Account verification failed',
        });
      }
    } catch (error) {
      console.error('Error during account verification:', error);
      setVerificationResult({
        success: false,
        message: error.response?.data?.message || 'Error verifying account',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-verification-container">
      <style>
        {`
          .account-verification-container {
            max-width: 500px;
            margin: 2rem auto;
            padding: 2rem;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            background-color: #ffffff;
          }

          .account-verification-form {
            display: flex;
            flex-direction: column;
          }

          .form-title {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
          }

          .form-group {
            margin-bottom: 1.25rem;
          }

          .form-label {
            display: block;
            margin-bottom: 0.5rem;
            color: #34495e;
            font-weight: 500;
          }

          .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #bdc3c7;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
          }

          .form-input:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
          }

          .verify-button {
            background-color: #3498db;
            color: white;
            padding: 0.75rem;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-top: 0.5rem;
          }

          .verify-button:hover {
            background-color: #2980b9;
          }

          .verify-button:disabled {
            background-color: #95a5a6;
            cursor: not-allowed;
          }

          .result-message {
            margin-top: 1.25rem;
            padding: 0.75rem;
            border-radius: 6px;
            text-align: center;
            font-weight: 500;
          }

          .result-message.success {
            background-color: #d5f5e3;
            color: #27ae60;
            border: 1px solid #2ecc71;
          }

          .result-message.error {
            background-color: #fadbd8;
            color: #e74c3c;
            border: 1px solid #e74c3c;
          }

          @media (max-width: 600px) {
            .account-verification-container {
              margin: 1rem;
              padding: 1.5rem;
            }
          }
        `}
      </style>

      <form onSubmit={verifyAccount} className="account-verification-form">
        <h2 className="form-title">Verify Your Account</h2>

        <div className="form-group">
          <label className="form-label">Account Holder Name:</label>
          <input
            type="text"
            name="name"
            value={accountDetails.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">IFSC Code:</label>
          <input
            type="text"
            name="ifsc"
            value={accountDetails.ifsc}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Account Number:</label>
          <input
            type="text"
            name="accountNumber"
            value={accountDetails.accountNumber}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="verify-button"
        >
          {loading ? 'Verifying...' : 'Verify Account'}
        </button>

        {verificationResult && (
          <div className={`result-message ${verificationResult.success ? 'success' : 'error'}`}>
            {verificationResult.message}
          </div>
        )}
      </form>
    </div>
  );
};

const ParentComponent = () => {
  const handleVerificationSuccess = (data) => {
    console.log('Account verified successfully!', data);
    // Handle success logic here
  };

  return (
    <div>
      <AccountVerification onVerificationSuccess={handleVerificationSuccess} />
    </div>
  );
};

export default ParentComponent;
