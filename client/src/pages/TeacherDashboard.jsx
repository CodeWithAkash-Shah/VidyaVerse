import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, GraduationCap, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import TeacherFeedbackSummary from '@/components/TeacherFeedbackSummary';
import apiService from '../services/api';

const TeacherDashboard = ({ user }) => {
    const [studentsNeedingAttention, setStudentsNeedingAttention] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch students needing attention
        const fetchStudents = async () => {
            try {
                const data = await apiService.teacher.getStudentsNeedingAttention();
                setStudentsNeedingAttention(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching students:', error.message);
                setError('Failed to load students. Please try again later.');
            }
        };
        fetchStudents();
    }, []);

    // Helper to get initials from username
    const getInitials = (name) => {
        const names = name.split(' ');
        return names.length > 1
            ? `${names[0][0]}${names[1][0]}`
            : name.slice(0, 2).toUpperCase();
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-bold">Welcome, {user?.username} 👋</h1>
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <Badge className="bg-scholar-100 text-scholar-700 dark:bg-scholar-900/30 dark:text-scholar-300 text-sm">
                        Spring Semester 2025
                    </Badge>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div>
                    <TeacherFeedbackSummary />
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-scholar-600 dark:text-scholar-400" />
                                Students Needing Attention
                            </CardTitle>
                            <CardDescription>Students who may need additional support</CardDescription>
                        </CardHeader>

                        <CardContent>
                            {error && (
                                <p className="text-red-500 text-sm mb-4">{error}</p>
                            )}
                            <div className="space-y-4">
                                {studentsNeedingAttention.length > 0 ? (
                                    studentsNeedingAttention.map((student) => (
                                        <div key={student._id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300">
                                                    {getInitials(student.username)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{student.username}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Class :  {student.class + 'th' || 'Unknown Grade'} • {student.feedback[0]?.subject || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            {student.needsAttention ? (
                                                <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                    Need Attention
                                                </Badge>
                                            ) :
                                                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                    No Attention needed right now
                                                </Badge>
                                            }
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No students need attention at this time.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>


            {/* <div className="flex justify-center gap-4 mt-8">
                    <Button asChild className="gap-2">
                        <Link to="/classes">
                            <GraduationCap className="h-4 w-4" />
                            Manage Classes
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="gap-2">
                        <Link to="/assignments">
                            <FileText className="h-4 w-4" />
                            Manage Assignments
                        </Link>
                    </Button>
                </div> */}
        </div>
    );
};

export default TeacherDashboard;