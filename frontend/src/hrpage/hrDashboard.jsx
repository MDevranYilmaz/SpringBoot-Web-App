"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Plus, Users, User, Mail, Building, Briefcase, FileText, Search, LogOut } from "lucide-react"
import { hrAPI, authAPI, getUserInfo, isAuthenticated } from "../services/api"

export default function HRDashboard() {
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [applicants, setApplicants] = useState([])
    const [userInfo, setUserInfo] = useState(null)

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        title: "",
        department: "",
        notes: "",
    })

    // Check authentication and get user info on component mount
    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/login';
            return;
        }

        const user = getUserInfo();
        setUserInfo(user);
        loadApplications();
    }, []);

    // Load applications based on user role
    const loadApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const user = getUserInfo();
            let applications;

            // Check if user is admin or HR
            if (user?.role === 'ADMIN') {
                applications = await hrAPI.getPendingApplications();
            } else {
                applications = await hrAPI.getMyApplications();
            }

            setApplicants(applications);
        } catch (err) {
            console.error('Error loading applications:', err);
            setError('Failed to load applications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setSubmitting(true);
            setError("");

            await hrAPI.submitApplication(formData);

            // Reset form and close it
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                username: "",
                title: "",
                department: "",
                notes: "",
            });
            setShowCreateForm(false);

            // Reload applications to show the new one
            await loadApplications();

        } catch (err) {
            console.error('Error submitting application:', err);
            setError('Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const updateStatus = async (id, newStatus) => {
        try {
            const reviewData = {
                applicationId: id,
                decision: newStatus.toUpperCase(), // Backend expects APPROVED/REJECTED
                rejectionReason: newStatus === 'rejected' ? 'Application declined' : null
            };

            await hrAPI.reviewApplication(reviewData);
            await loadApplications(); // Reload to get updated data

        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update application status.');
        }
    }

    const getStatusBadge = (status) => {
        const statusString = status?.toString().toLowerCase() || 'pending';
        const statusConfig = {
            pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Pending" },
            approved: { color: "bg-green-100 text-green-800 border-green-200", text: "Approved" },
            rejected: { color: "bg-red-100 text-red-800 border-red-200", text: "Rejected" },
        }
        const config = statusConfig[statusString] || statusConfig.pending;
        return <Badge className={`${config.color} border`}>{config.text}</Badge>
    }

    const filteredApplicants = applicants.filter((applicant) => {
        const matchesSearch =
            applicant.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.department?.toLowerCase().includes(searchTerm.toLowerCase())

        // Show pending applications for review, or all applications based on user role
        const user = getUserInfo();
        if (user?.role === 'ADMIN') {
            return matchesSearch; // Admin can see all applications
        } else {
            return matchesSearch && applicant.status?.toString().toLowerCase() === "pending";
        }
    })

    const getStatusCounts = () => {
        return {
            total: applicants.length,
            pending: applicants.filter((a) => a.status?.toString().toLowerCase() === "pending").length,
            approved: applicants.filter((a) => a.status?.toString().toLowerCase() === "approved").length,
            rejected: applicants.filter((a) => a.status?.toString().toLowerCase() === "rejected").length,
        }
    }

    const statusCounts = getStatusCounts()

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-white">HR Dashboard</h1>
                                <p className="text-sm text-white/80">Manage applicants and recruitment</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={() => {
                                authAPI.logout();
                                window.location.href = '/login';
                            }}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Applicants</p>
                                    <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                                </div>
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Created</p>
                                    <p className="text-2xl font-bold text-teal-600">{statusCounts.total}</p>
                                </div>
                                <Users className="w-8 h-8 text-teal-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-red-700">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                                setError("");
                                loadApplications();
                            }}
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="ml-3 text-white">Loading applications...</p>
                    </div>
                )}

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search pending applicants..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white/90 backdrop-blur-sm border-white/20"
                            />
                        </div>
                    </div>

                    <Button onClick={() => setShowCreateForm(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Applicant
                    </Button>
                </div>

                {/* Create Form Modal */}
                {showCreateForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Create New Applicant</span>
                                    <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                                        ✕
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                            <Input
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                            <Input
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                                            <Input
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter username"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                            <Input
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter job title"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                            <Input
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter department"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <Textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            placeholder="Add any additional notes about the applicant..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowCreateForm(false)}
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-teal-600 hover:bg-teal-700"
                                            disabled={submitting}
                                        >
                                            {submitting ? "Creating..." : "Create Applicant"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Applicants List */}
                <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Pending Applicants ({filteredApplicants.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredApplicants.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No applicants found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredApplicants.map((applicant) => (
                                    <div
                                        key={applicant.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-teal-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {applicant.firstName} {applicant.lastName}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">{applicant.title}</p>
                                                    </div>
                                                    {getStatusBadge(applicant.status)}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <Mail className="w-4 h-4 mr-2" />
                                                        {applicant.email}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Building className="w-4 h-4 mr-2" />
                                                        {applicant.department}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Briefcase className="w-4 h-4 mr-2" />@{applicant.username}
                                                    </div>
                                                </div>

                                                {applicant.notes && (
                                                    <div className="mt-2 flex items-start">
                                                        <FileText className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                                                        <p className="text-sm text-gray-600">{applicant.notes}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
