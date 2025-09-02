import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Paymenthistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [autoApproving, setAutoApproving] = useState(false);

  const API_BASE_URL = 'https://api.pg.gradezy.in/api';

  useEffect(() => {
    fetchPaymentHistory();
  }, [filter]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${API_BASE_URL}/pg-payment/history`;
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      
      console.log('Fetching payment history from:', url);
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        setPayments(response.data.data);
        console.log('Payment history loaded:', response.data.data.length, 'payments');
      } else {
        setError('Failed to fetch payment history');
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setError('Error loading payment history');
    } finally {
      setLoading(false);
    }
  };

  const autoApprovePendingPayments = async () => {
    try {
      setAutoApproving(true);
      setError(null);
      
      console.log('🔄 Auto-approving pending payments...');
      
      const response = await axios.post(`${API_BASE_URL}/pg-payment/auto-approve-pending`);
      
      if (response.data.success) {
        console.log('✅ Auto-approval successful:', response.data.message);
        alert(`Successfully approved ${response.data.approvedCount} pending payments!`);
        
        // Refresh the payment history
        await fetchPaymentHistory();
      } else {
        setError(response.data.message || 'Auto-approval failed');
      }
    } catch (error) {
      console.error('Error auto-approving payments:', error);
      setError('Error auto-approving payments: ' + (error.response?.data?.message || error.message));
    } finally {
      setAutoApproving(false);
    }
  };

  const approveSinglePayment = async (paymentId, transactionId) => {
    try {
      console.log('🔄 Approving single payment:', paymentId);
      
      const response = await axios.post(`${API_BASE_URL}/pg-payment/approve-single`, {
        paymentId,
        transactionId
      });
      
      if (response.data.success) {
        console.log('✅ Single payment approved successfully');
        alert('Payment approved successfully!');
        
        // Refresh the payment history
        await fetchPaymentHistory();
      } else {
        alert('Failed to approve payment: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error approving single payment:', error);
      alert('Error approving payment: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'SUCCESS': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'FAILED': 'bg-red-100 text-red-800',
      'PROCESSING': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const pendingPayments = payments.filter(payment => payment.paymentStatus === 'PENDING');
  const successfulPayments = payments.filter(payment => payment.paymentStatus === 'SUCCESS');
  const failedPayments = payments.filter(payment => payment.paymentStatus === 'FAILED');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
          <p className="text-gray-600">Manage and monitor all payment transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{successfulPayments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPayments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{failedPayments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Approve Section */}
        {pendingPayments.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  ⚠️ Pending Payments Require Approval
                </h3>
                <p className="text-yellow-700">
                  There are {pendingPayments.length} payments in pending status. 
                  You can auto-approve all pending payments or approve them individually.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={autoApprovePendingPayments}
                  disabled={autoApproving}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    autoApproving
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {autoApproving ? 'Approving...' : 'Auto-Approve All Pending'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({payments.length})
            </button>
            <button
              onClick={() => setFilter('SUCCESS')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'SUCCESS'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Successful ({successfulPayments.length})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'PENDING'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({pendingPayments.length})
            </button>
            <button
              onClick={() => setFilter('FAILED')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'FAILED'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Failed ({failedPayments.length})
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment Transactions</h3>
          </div>
          
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' ? 'No payment transactions have been made yet.' : `No ${filter.toLowerCase()} payments found.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.paymentId}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.transactionId}
                          </div>
                          {payment.pgDetails && (
                            <div className="text-xs text-gray-400 mt-1">
                              {payment.pgDetails.pgName} - {payment.pgDetails.room}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.userEmail}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.userMobile}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatAmount(payment.amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.amountInPaise} paise
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.paymentStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {payment.paymentStatus === 'PENDING' && (
                          <button
                            onClick={() => approveSinglePayment(payment._id, payment.transactionId)}
                            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-lg transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {payment.paymentStatus === 'SUCCESS' && (
                          <span className="text-green-600 bg-green-100 px-3 py-1 rounded-lg">
                            ✓ Approved
                          </span>
                        )}
                        {payment.paymentStatus === 'FAILED' && (
                          <span className="text-red-600 bg-red-100 px-3 py-1 rounded-lg">
                            ✗ Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Paymenthistory;
