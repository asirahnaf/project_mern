import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const FarmerClaimsList = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const res = await axios.get('http://localhost:5050/api/insurance/my-claims', {
                withCredentials: true
            });
            setClaims(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Insurance Claims</h2>
                <Link
                    to="new"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                    New Claim
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading claims...</div>
            ) : claims.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">No claims submitted yet.</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {claims.map((claim) => (
                            <li key={claim._id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-medium text-green-600">{claim.cropName}</p>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                                                {claim.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Policy: {claim.policyNumber}</p>
                                        <p className="text-sm text-gray-500">Date: {format(new Date(claim.incidentDate), 'MMM dd, yyyy')}</p>
                                        <p className="text-sm text-gray-500">Amount: ${claim.claimAmount}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Submitted on {format(new Date(claim.createdAt), 'MMM dd, yyyy')}</p>
                                    </div>
                                </div>
                                {claim.adminComments && (
                                    <div className="mt-2 bg-gray-50 p-2 rounded text-sm text-gray-600 border-l-4 border-blue-400">
                                        <span className="font-semibold">Admin Note:</span> {claim.adminComments}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FarmerClaimsList;
