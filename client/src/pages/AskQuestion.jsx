import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, HelpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import apiService from '@/services/api';
import { useSelector } from 'react-redux';
import io from "socket.io-client";
const API_BASE_URL = import.meta.env.VITE_API_SOCKET
const socket = io(API_BASE_URL);


const AskQuestion = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const data = useSelector(state => state.auth);
    const user = data.user;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!title || !question || !subject || !topic) {
            toast.error('Please fill in all required fields');
            return;
        }
        const payload = {
            title,
            body: question,
            subject,
            topic,
            studentId: user._id,
        };

        try {
            const doubt = await apiService.doubts.ask(payload);
            socket.emit("postDoubt", { ...doubt}, user.class);
            toast.success('Your question has been posted! You will be notified when someone answers.');
            navigate('/doubts');
            setLoading(false);
        } catch (error) {
            toast.error('Error posting question: ' + error.message);
        }finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-3xl">
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 -ml-2"
                    onClick={() => navigate('/doubts')}
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Doubts
                </Button>

                <h1 className="text-2xl font-bold mb-6 flex items-center">
                    <HelpCircle className="h-6 w-6 mr-2 text-scholar-600 dark:text-scholar-400" />
                    Ask a Question
                </h1>

                <Card>
                    <CardHeader>
                        <CardTitle>What do you want to ask?</CardTitle>
                        <CardDescription>Be specific in your question to get the best answers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Question Title</Label>
                                <Input
                                    id="title"
                                    placeholder="E.g., How do I solve quadratic equations?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Select value={subject} onValueChange={setSubject}>
                                        <SelectTrigger id="subject">
                                            <SelectValue placeholder="Select subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                                            <SelectItem value="Physics">Physics</SelectItem>
                                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                                            <SelectItem value="Biology">Biology</SelectItem>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="History">History</SelectItem>
                                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="topic">Topic</Label>
                                    <Select value={topic} onValueChange={setTopic}>
                                        <SelectTrigger id="topic">
                                            <SelectValue placeholder="Select topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subject === 'Mathematics' && (
                                                <>
                                                    <SelectItem value="Algebra">Algebra</SelectItem>
                                                    <SelectItem value="Calculus">Calculus</SelectItem>
                                                    <SelectItem value="Geometry">Geometry</SelectItem>
                                                    <SelectItem value="Statistics">Statistics</SelectItem>
                                                </>
                                            )}
                                            {subject === 'Physics' && (
                                                <>
                                                    <SelectItem value="Mechanics">Mechanics</SelectItem>
                                                    <SelectItem value="Thermodynamics">Thermodynamics</SelectItem>
                                                    <SelectItem value="Waves">Waves</SelectItem>
                                                    <SelectItem value="Electricity & Magnetism">Electricity & Magnetism</SelectItem>
                                                </>
                                            )}
                                            {(subject && subject !== 'Mathematics' && subject !== 'Physics') && (
                                                <SelectItem value="General">General</SelectItem>
                                            )}
                                            {!subject && (
                                                <SelectItem value="select-subject">Select a subject first</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="question">Your Question</Label>
                                <Textarea
                                    id="question"
                                    placeholder="Describe your question in detail..."
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    rows={6}
                                    className="resize-y"
                                />
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => navigate('/doubts')}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post Question"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default AskQuestion;