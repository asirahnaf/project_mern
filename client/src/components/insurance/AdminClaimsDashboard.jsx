import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const AdminClaimsDashboard = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState(null); // For modal/action
    const [actionComment, setActionComment] = useState('');

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const res = await axios.get('http://localhost:5050/api/insurance/all-claims', {
                withCredentials: true
            });
            setClaims(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch claims");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedClaim) return;

        try {
            await axios.put(`http://localhost:5050/api/insurance/claims/${selectedClaim._id}`, {
                status,
                adminComments: actionComment
            }, {
                withCredentials: true
            });

            toast.success(`Claim ${status} successfully`);
            fetchClaims();
            setSelectedClaim(null);
            setActionComment('');
        } catch (error) {
            console.error(error);
            toast.error("Failed to update claim");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Insurance Claims</h2>

            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {claims.map((claim) => (
                                <tr key={claim._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {claim.farmerId?.firstname} {claim.farmerId?.lastname}
                                        </div>
                                        <div className="text-sm text-gray-500">{claim.farmerId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 font-medium">{claim.cropName}</div>
                                        <div className="text-sm text-gray-500">Pol: {claim.policyNumber}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{format(new Date(claim.incidentDate), 'MMM dd, yyyy')}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs" title={claim.description}>{claim.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${claim.claimAmount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                                            {claim.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {claim.status === 'Pending' && (
                                            <button
                                                onClick={() => setSelectedClaim(claim)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Review
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Simplified Review Modal */}
            {selectedClaim && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Review Claim</h3>
                        <p className="mb-2"><strong>Farmer:</strong> {selectedClaim.farmerId?.firstname}</p>
                        <p className="mb-2"><strong>Issue:</strong> {selectedClaim.description}</p>
                        <textarea
                            className="w-full border rounded p-2 mb-4"
                            placeholder="Admin comments (optional)"
                            value={actionComment}
                            onChange={(e) => setActionComment(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedClaim(null)}
                                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('Rejected')}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('Approved')}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminClaimsDashboard;
