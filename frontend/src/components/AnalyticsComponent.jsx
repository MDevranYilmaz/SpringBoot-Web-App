import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { analyticsAPI } from '../services/api';

const AnalyticsComponent = () => {
    const [formData, setFormData] = useState({
        notes: '',
        department: '',
        jobTitle: ''
    });
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResponse('');

        try {
            const result = await analyticsAPI.generateAiResponse(
                formData.notes,
                formData.department,
                formData.jobTitle
            );
            setResponse(result);
        } catch (err) {
            setError('Failed to generate AI response. Please try again.');
            console.error('Error generating AI response:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    AI Analytics Response Generator
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                        </label>
                        <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Enter your notes here..."
                            className="w-full min-h-[100px]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                        </label>
                        <Input
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            placeholder="e.g., HR, Engineering, Marketing"
                            className="w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title
                        </label>
                        <Input
                            id="jobTitle"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            placeholder="e.g., Software Engineer, HR Manager"
                            className="w-full"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate AI Response'}
                    </Button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {response && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">
                            AI Generated Response:
                        </h3>
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="whitespace-pre-wrap text-gray-700">
                                {response}
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AnalyticsComponent;
