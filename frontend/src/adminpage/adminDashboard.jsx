"use client"

import { useState, useEffect } from "react"
import { LogOut, Users, BarChart3 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import AnalyticsComponent from "../components/AnalyticsComponent"

const AdminDashboard = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState("applications") // New tab state

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('authToken');
                // Updated URL to use gateway service
                const response = await fetch("http://localhost:8081/api/v1/hr/admin/all-applications", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    setApplications(data)
                } else {
                    console.error("Failed to fetch applications")
                }
            } catch (error) {
                console.error("Error fetching applications:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [])

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            // Updated URL to use gateway service
            const response = await fetch("http://localhost:8081/api/v1/hr/admin/review-application", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    applicationId: id,
                    approved: true,
                    rejectionReason: null
                }),
            })

            if (response.ok) {
                setApplications(applications.map((app) => (app.id === id ? { ...app, status: "APPROVED" } : app)))
            } else {
                console.error("Failed to approve application")
            }
        } catch (error) {
            console.error("Error approving application:", error)
        }
    }

    const handleReject = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            // Updated URL to use gateway service
            const response = await fetch("http://localhost:8081/api/v1/hr/admin/review-application", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    applicationId: id,
                    approved: false,
                    rejectionReason: "Rejected by admin"
                }),
            })

            if (response.ok) {
                setApplications(applications.map((app) => (app.id === id ? { ...app, status: "REJECTED" } : app)))
            } else {
                console.error("Failed to reject application")
            }
        } catch (error) {
            console.error("Error rejecting application:", error)
        }
    }

    const filteredApplications = applications.filter(
        (app) =>
            app?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
            app?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
            app?.email?.toLowerCase().includes(search.toLowerCase()) ||
            app?.username?.toLowerCase().includes(search.toLowerCase()) ||
            app?.title?.toLowerCase().includes(search.toLowerCase()) ||
            app?.department?.toLowerCase().includes(search.toLowerCase()) ||
            app?.notes?.toLowerCase().includes(search.toLowerCase()),
    )

    const getStatusBadge = (status) => {
        const statusString = status?.toString().toLowerCase() || "pending"

        if (statusString === "rejected") {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    Rejected
                </span>
            )
        }
        if (statusString === "approved") {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Approved
                </span>
            )
        }
        if (statusString === "pending") {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                    Pending
                </span>
            )
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                {statusString}
            </span>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500 flex items-center justify-center">
                <h1 className="text-3xl font-semibold text-white">Loading...</h1>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500">
            {/* Header with Tree Theme */}
            <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 relative overflow-hidden">
                {/* Background Nature Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full opacity-80"></div>
                    <div className="absolute top-8 left-16 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                    <div className="absolute top-6 right-20 w-1 h-1 bg-white rounded-full opacity-80"></div>
                    <div className="absolute top-12 right-8 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>

                    {/* Small Trees */}
                    <div className="absolute top-2 left-32">
                        <div className="w-0.5 h-4 bg-emerald-800 relative">
                            <div
                                className="absolute -top-2 -left-1 w-3 h-4 bg-emerald-700"
                                style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                            ></div>
                        </div>
                    </div>
                    <div className="absolute top-1 right-32">
                        <div className="w-0.5 h-5 bg-emerald-800 relative">
                            <div
                                className="absolute -top-3 -left-1.5 w-4 h-6 bg-emerald-700"
                                style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-white">🌲 Admin Forest Dashboard</h1>
                                <p className="text-sm text-white/80">Review and nurture applications</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={() => {
                                localStorage.removeItem('authToken');
                                localStorage.removeItem('userRole');
                                localStorage.removeItem('username');
                                localStorage.removeItem('userInfo');
                                window.location.href = "/login";
                            }}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Tab Navigation */}
                <div className="mb-6">
                    <div className="border-b border-gray-200 bg-white/90 backdrop-blur-sm rounded-t-lg">
                        <nav className="-mb-px flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab("applications")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "applications"
                                    ? "border-emerald-500 text-emerald-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <Users className="w-4 h-4 inline mr-2" />
                                Applications
                            </button>
                            <button
                                onClick={() => setActiveTab("analytics")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "analytics"
                                    ? "border-emerald-500 text-emerald-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <BarChart3 className="w-4 h-4 inline mr-2" />
                                Analytics
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "applications" && (
                    <>
                        <div className="mb-4">
                            <Input
                                type="text"
                                placeholder="Search applications..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-white/90 backdrop-blur-sm border-white/20 focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Applications ({filteredApplications.length})</h3>
                            </div>

                            {filteredApplications.length === 0 ? (
                                <div className="text-center py-8">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No applications found</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {filteredApplications.map((application) => (
                                        <div key={application.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    {/* Main Info */}
                                                    <div className="flex items-center space-x-4 mb-3">
                                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                                            <Users className="w-6 h-6 text-emerald-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-semibold text-gray-900">
                                                                {application.firstName} {application.lastName}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">{application.title || 'No title specified'}</p>
                                                        </div>
                                                        <div>{getStatusBadge(application.status)}</div>
                                                    </div>

                                                    {/* Detailed Information Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center text-gray-600">
                                                                <span className="font-medium">📧 Email:</span>
                                                                <span className="ml-2">{application.email}</span>
                                                            </div>
                                                            <div className="flex items-center text-gray-600">
                                                                <span className="font-medium">👤 Username:</span>
                                                                <span className="ml-2">@{application.username}</span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex items-center text-gray-600">
                                                                <span className="font-medium">🏢 Department:</span>
                                                                <span className="ml-2">{application.department || 'Not specified'}</span>
                                                            </div>
                                                            <div className="flex items-center text-gray-600">
                                                                <span className="font-medium">📅 Applied:</span>
                                                                <span className="ml-2">
                                                                    {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex items-center text-gray-600">
                                                                <span className="font-medium">👥 Submitted by:</span>
                                                                <span className="ml-2">{application.submittedByHR || 'Unknown'}</span>
                                                            </div>
                                                            <div className="flex items-center text-gray-600">
                                                                <span className="font-medium">🆔 ID:</span>
                                                                <span className="ml-2">#{application.id}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Notes Section */}
                                                    {application.notes && (
                                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                            <span className="font-medium text-gray-700">📝 Notes:</span>
                                                            <p className="text-gray-600 mt-1">{application.notes}</p>
                                                        </div>
                                                    )}

                                                    {/* Review Notes (if any) */}
                                                    {application.rejectionReason && (
                                                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                                                            <span className="font-medium text-red-700">❌ Rejection Reason:</span>
                                                            <p className="text-red-600 mt-1">{application.rejectionReason}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col space-y-2 lg:ml-4">
                                                    {(application.status === 'PENDING' || application.status?.toString().toUpperCase() === 'PENDING') ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[100px]"
                                                                onClick={() => handleApprove(application.id)}
                                                            >
                                                                ✅ Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-red-300 text-red-600 hover:bg-red-50 min-w-[100px]"
                                                                onClick={() => handleReject(application.id)}
                                                            >
                                                                ❌ Reject
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-gray-500 italic px-4 py-2 bg-gray-100 rounded-md text-center">
                                                            📋 Already reviewed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Analytics Tab Content */}
                {activeTab === "analytics" && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg">
                        <AnalyticsComponent />
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard