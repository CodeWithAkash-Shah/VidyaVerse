
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuestionCard from '@/components/QuestionCard';
import { MessageSquarePlus, Filter, PlusCircle, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Bot, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import apiService from '@/services/api';
import { useSelector } from 'react-redux';
import io from "socket.io-client";
const API_BASE_URL = import.meta.env.VITE_API_SOCKET
const socket = io(API_BASE_URL);



const Doubts = () => {
    const data = useSelector(state => state.auth);
    const user = data.user;

    const [searchTerm, setSearchTerm] = useState('');
    const [activeSubject, setActiveSubject] = useState("All");
    const [filterByStatus, setFilterByStatus] = useState([]);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const [openAnswerDialog, setOpenAnswerDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [viewedQuestion, setViewedQuestion] = useState(null);
    const [myQuestions, setMyQuestions] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    // Timer state
    const [aiLoading, setAiLoading] = useState({});
    const [aiResponse, setAiResponse] = useState(null);

    // Added subject filters
    const subjects = ["All", "Math", "Science", "English", "History", "Computer Science", "Physics", "Biology"];
    const statuses = ["Has AI response", "Solved", "With expert answer", "Unanswered"];


    // fetching all questions
    const fetchAllQuestions = async () => {
        try {
            await apiService.doubts.getAllDoubts(user.class).then((data) => {
                setAllQuestions(data);
            })
        } catch (error) {
            console.error("Error fetching doubts:", error);
            toast({
                title: "Error",
                description: "Failed to fetch doubts. Please try again later.",
                variant: "destructive"
            });
        }

    }


    useEffect(() => {
        socket.emit("joinClass", user.class);
        fetchAllQuestions();
        fetchMyQuestions();

        socket.on("newDoubt", (doubt) => {
            setAllQuestions((prev) => [doubt, ...prev]);
            // setNotificationCount((prev) => prev + 1);
        });

        socket.on("newAnswer", ({ doubtId, answer }) => {
            setAllQuestions((prev) =>
                prev.map((doubt) =>
                    doubt._id === doubtId
                        ? { ...doubt, answers: [...doubt.answers, answer] }
                        : doubt
                )
            );
            // setNotificationCount((prev) => prev + 1); // Notification fuctionaity will be add later in future
        });

        //   socket.on("newNotification", ({ type, doubtId }) => {
        //     setNotificationCount((prev) => prev + 1);
        //   });

        return () => {
            socket.off("newDoubt");
            socket.off("newAnswer");
            socket.off("newNotification");
        };
    }, [user.class]);


    // fetching current student questions
    const handleAskAI = async (question) => {
        if (!question) return;
        setAiLoading((prev) => ({ ...prev, [question._id]: true }));
        try {
            const payload = {
                prompt: question.body,
                studentId: user._id,
                isNewConversation: true,
                Subject: question.subject,
                Topic: question.topic,
                Question: question.title,
            };
            const response = await apiService.gemini.ask(payload);
            setAiResponse(response.response);

            // Submit AI response as an answer
            await submitAnswer(response.response, true, question._id);

            socket.emit("postDoubt", { ...question, class: user.class });

            // setViewedQuestion((prev) => ({
            //     ...(prev || {}),
            //     comments: [
            //         ...(prev?.comments || []),
            //         {
            //             id: `ai-${Date.now()}`,
            //             text: response.response,
            //             isAI: true,
            //             isSolution: false,
            //             timestamp: new Date().toLocaleString(),
            //             author: { name: 'AI', initials: 'AI' },
            //         },
            //     ],
            // }));

            toast.success('AI response received!');
        } catch (error) {
            console.error('Error asking AI:', error);
            toast.error('Failed to get AI response. Please try again.');
        } finally {
            setAiLoading((prev) => ({ ...prev, [question._id]: false }));
        }
    };

    const fetchMyQuestions = async () => {
        try {
            await apiService.doubts.getStudentDoubts(user._id)
                .then((data) => {
                    setMyQuestions(data);
                    console.log("my data", data);

                })
        } catch (error) {
            console.error("Error fetching my doubts:", error);
            toast({
                title: "Error",
                description: "Failed to fetch your doubts. Please try again later.",
                variant: "destructive"
            });
        }
    }

    // Handle answering a question
    const handleAnswer = (questionId) => {
        setSelectedQuestionId(questionId);
        setAnswerText('');
        setOpenAnswerDialog(true);
    };

    // const submitAnswer = async () => {
    //     if (!answerText.trim()) {
    //         toast.error("Please provide an answer before submitting.", {
    //             title: "Answer Required"
    //         });
    //         return;
    //     }

    //     setLoading(true);

    //     try {
    //         const payload = {
    //             content: answerText,
    //             studentId: user._id,
    //             is_ai: false
    //         };

    //         // Refetch questions to update the UI
    //         await Promise.all([fetchAllQuestions(), fetchMyQuestions()]);
    //         // Make API call to submit the answer
    //         const answer = await apiService.doubts.addAnswer(selectedQuestionId, payload);

    //         socket.emit("postAnswer", {
    //             doubtId: selectedQuestionId,
    //             classId: user.class,
    //             answer
    //         });

    //         toast.success("Your answer has been posted successfully.");

    //         setOpenAnswerDialog(false);
    //         setOpenViewDialog(false);
    //         setAnswerText('');
    //     } catch (error) {
    //         console.error("Error submitting answer:", error);
    //         toast({
    //             title: "Error",
    //             description: error.response?.data?.message || "Failed to submit your answer. Please try again later.",
    //             variant: "destructive"
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    //Answer section

    const submitAnswer = async (content = "", isAI = false, questionId = null) => {
        const textToSubmit = isAI ? content : answerText;
        if (!textToSubmit.trim()) {
            toast.error("Please provide an answer before submitting.", {
                title: "Answer Required"
            });
            return;
        }

        setLoading(true);

        try {
            const payload = {
                content: textToSubmit,
                studentId: isAI ? `temp-${Date.now()}` : user._id,
                is_ai: isAI ? true : false,
            };

            if (!isAI) {
                payload.answered_by = user._id;
            }

            // Optimistically update the local state
            const newAnswer = {
                _id: `temp-${Date.now()}`,
                content: textToSubmit,
                studentId: isAI ? `temp-${Date.now()}` : user._id,
                is_ai: isAI ? true : false,
                createdAt: new Date().toISOString(),
                answered_by: isAI ? { username: 'AI' } : { username: user.username }
            };
            setAllQuestions((prev) =>
                prev.map((doubt) =>
                    doubt._id === selectedQuestionId
                        ? { ...doubt, answers: [...(doubt.answers || []), newAnswer] }
                        : doubt
                )
            );

            setMyQuestions((prev) =>
                prev.map((doubt) =>
                    doubt._id === selectedQuestionId
                        ? { ...doubt, answers: [...(doubt.answers || []), newAnswer] }
                        : doubt
                )
            );

            // Update viewedQuestion if open
            if (openViewDialog && viewedQuestion?._id === selectedQuestionId) {
                setViewedQuestion((prev) => ({
                    ...prev,
                    comments: [
                        ...(prev?.comments || []),
                        {
                            id: newAnswer._id,
                            text: textToSubmit,
                            isAI,
                            isSolution: false,
                            timestamp: new Date().toLocaleString(),
                            author: {
                                name: isAI ? "AI" : user.username,
                                initials: isAI ? "AI" : user.username.split(" ").map((n) => n[0]?.toUpperCase()).join(""),
                            },
                        },
                    ],
                }));
            }

            // Make API call to submit the answer
            const answer = await apiService.doubts.addAnswer(isAI ? questionId : selectedQuestionId, payload);

            socket.emit("postAnswer", {
                doubtId: selectedQuestionId,
                classId: user.class,
                answer
            });

            // Refetch questions to ensure consistency
            await Promise.all([fetchAllQuestions(), fetchMyQuestions()]);

            toast.success("Your answer has been posted successfully.");

            setOpenAnswerDialog(false);
            setOpenViewDialog(false);
            if (!isAI) {
                setAnswerText('');
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to submit your answer. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewQuestion = (questionId) => {
        const question = [...allQuestions, ...myQuestions].find(q => q._id === questionId);

        // Map answers to the `comments` format expected by the UI
        const comments = question?.answers?.map(answer => ({
            id: answer._id,
            text: answer.content,
            isAI: answer.is_ai,
            isSolution: false,
            timestamp: new Date(answer.createdAt).toLocaleString(),
            author: {
                name: answer?.answered_by?.username || 'AI',
                initials: (
                    answer?.answered_by?.username
                        ? answer.answered_by.username
                            .split(' ')
                            .map(n => n[0]?.toUpperCase())
                            .join('')
                        : 'AI'
                )
            }

        }));

        const questionWithComments = {
            ...question,
            comments
        };

        setViewedQuestion(questionWithComments);
        setOpenViewDialog(true);
        setAiResponse(null);
    };

    // const GetAnsweredQuestions = async () => {
    //     myQuestions.filter((question) => {
    //         if (question.answers.length > 0) {
    //             setAnsweredQuestions((prev) => [...prev, question]);
    //         }
    //     }
    //     )
    //     console.log(answeredQuestions);
    // }
    // Filter questions based on search term and subject
    const filteredQuestions = useMemo(() => {
        const allQs = [...myQuestions, ...allQuestions];
        const uniqueQs = Array.from(new Map(allQs.map(q => [q._id, q])).values());

        return uniqueQs.filter(q => {
            // Subject filter
            if (activeSubject !== "All" && q.subject !== activeSubject) {
                return false;
            }

            // Search term filter
            if (searchTerm && !q.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !q.body.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }

            // Status filters
            if (filterByStatus.length > 0) {
                if (filterByStatus.includes("Has AI response") && !q.hasAiResponse) {
                    return false;
                }
                if (filterByStatus.includes("Solved") && !q.isSolved) {
                    return false;
                }
                if (filterByStatus.includes("With expert answer") &&
                    (!q.answerBadge || q.answerBadge.type !== 'expert')) {
                    return false;
                }
                if (filterByStatus.includes("Unanswered") && q.replies > 0) {
                    return false;
                }
            }

            return true;
        });
    }, [myQuestions, allQuestions, searchTerm, activeSubject, filterByStatus]);

    // Filter my questions
    const filteredMyQuestions = useMemo(() => {
        return myQuestions.filter(q => {
            // First check if it's my question
            if (q.author._id !== user._id) return false;

            // Then apply your other filters
            if (activeSubject !== "All" && q.subject !== activeSubject) return false;
            if (searchTerm && !q.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !q.body.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            if (filterByStatus.length > 0) {
                if (filterByStatus.includes("Has AI response") && !q.hasAiResponse) return false;
                if (filterByStatus.includes("Solved") && !(q.isSolved || q.answers?.length > 0)) return false;
            }
            return true;
        });
    }, [myQuestions, searchTerm, activeSubject, filterByStatus, user._id]);


    // // Filter answered questions
    // const filteredAnsweredQuestions = useMemo(() => {
    //     return answeredQuestions.filter(q => {
    //         if (!(q.isSolved || q.answers?.length > 0)) return false;
    //         if (activeSubject !== "All" && q.subject !== activeSubject) return false;
    //         if (searchTerm && !q.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    //             !q.body.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    //         return true;
    //     });
    // }, [answeredQuestions, searchTerm, activeSubject]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setActiveSubject('All');
        setFilterByStatus([]);
    };

    // Check if question is older than 10 seconds
    const isQuestionOlderThan10Seconds = (createdAt) => {
        if (!createdAt) return false;
        const createdTime = new Date(createdAt).getTime();
        const currentTime = new Date().getTime();
        const diffSeconds = (currentTime - createdTime) / 1000;
        return diffSeconds > 10;
    };


    return (
        <div>
            <Navbar />
            <div className="container mx-auto px-4 pb-20 md:pb-6 pt-4 max-w-4xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-foreground">Doubts & Questions</h1>
                    <Button className="w-full sm:w-auto hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600" asChild>
                        <Link to="/ask-question">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Ask a Question
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <Input
                            placeholder="Search questions..."
                            className="bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Status
                                    {filterByStatus.length > 0 && (
                                        <span className="ml-1 w-5 h-5 rounded-full bg-scholar-600 text-white text-xs flex items-center justify-center">
                                            {filterByStatus.length}
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {statuses.map((status) => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={filterByStatus.includes(status)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setFilterByStatus([...filterByStatus, status]);
                                            } else {
                                                setFilterByStatus(filterByStatus.filter(s => s !== status));
                                            }
                                        }}
                                    >
                                        {status}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {(searchTerm || activeSubject !== 'All' || filterByStatus.length > 0) && (
                            <Button variant="ghost" onClick={clearFilters}>
                                <X className="h-4 w-4 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                {/* Subject filter pills */}
                <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
                    {subjects.map((subject) => (
                        <Button
                            key={subject}
                            variant={activeSubject === subject ? "default" : "outline"}
                            size="sm"
                            className={`rounded-full ${activeSubject === subject
                                ? "hover:bg-scholar-700 text-white cursor-pointer"
                                : "bg-background dark:bg-gray-800 cursor-pointer"
                                }`}
                            onClick={() => setActiveSubject(subject)}
                        >
                            {subject}
                        </Button>
                    ))}
                </div>

                <Tabs
                    defaultValue="all"
                    className="w-full"
                    onValueChange={(value) => {
                        setAllQuestions([]);
                        setMyQuestions([]);
                        if (value === "all") {
                            fetchAllQuestions();
                        } else if (value === "my") {
                            fetchMyQuestions();
                        }
                    }}
                >
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50 dark:bg-gray-800/50 ">
                        <TabsTrigger value="all" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 cursor-pointer" onClick={fetchAllQuestions}>
                            All Questions</TabsTrigger>
                        <TabsTrigger value="my" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 cursor-pointer" onClick={fetchMyQuestions}>My Questions</TabsTrigger>
                        {/* <TabsTrigger value="answered" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 cursor-pointer" onClick={filteredAnsweredQuestions} >Answered</TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="all" className="mt-4 space-y-4">
                        {filteredQuestions.length > 0 ? (
                            <>
                                {filteredQuestions.map(question => (
                                    <QuestionCard
                                        key={question._id}
                                        question={question}
                                        onAnswer={() => handleAnswer(question._id)}
                                        onView={() => handleViewQuestion(question._id)}
                                        showViewAnswer={question.answers?.length > 0}
                                        isQuestionOlderThan10Seconds={isQuestionOlderThan10Seconds}
                                        handleAskAI={handleAskAI}
                                        aiResponse={aiResponse}
                                        aiLoading={aiLoading[question._id] || false}
                                        user={user}
                                    />
                                ))}

                                <Button variant="outline" className="w-full border-dashed bg-background dark:bg-gray-800/60">
                                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                                    Load More Questions
                                </Button>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <MessageSquarePlus className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No questions found</h3>
                                <p className="mt-1 text-muted-foreground">Try adjusting your filters or search criteria</p>
                                {(searchTerm || activeSubject !== 'All' || filterByStatus.length > 0) && (
                                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="my" className="mt-4 space-y-4">
                        {filteredMyQuestions.length > 0 ? (
                            filteredMyQuestions.map(question => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    onAnswer={() => handleAnswer(question.id)}
                                    onView={() => handleViewQuestion(question.id)}
                                    showViewAnswer={question.answers?.length > 0}
                                    isQuestionOlderThan10Seconds={isQuestionOlderThan10Seconds}
                                    handleAskAI={handleAskAI}
                                    aiResponse={aiResponse}
                                    aiLoading={aiLoading[question._id] || false}
                                    user={user}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <MessageSquarePlus className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No questions found</h3>
                                <p className="mt-1 text-muted-foreground">You haven't asked any questions yet or none match your filters</p>
                                {(searchTerm || activeSubject !== 'All' || filterByStatus.length > 0) && (
                                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </TabsContent>

                    {/* <TabsContent value="answered" className="mt-4 space-y-4">
                        {filteredAnsweredQuestions.length > 0 ? (
                            filteredAnsweredQuestions.map(question => (
                                <QuestionCard
                                    key={question._id} // Use _id, not id
                                    question={question}
                                    onAnswer={() => handleAnswer(question._id)}
                                    onView={() => handleViewQuestion(question._id)}
                                    showViewAnswer={question.answers?.length > 0}
                                    isQuestionOlderThan10Seconds={isQuestionOlderThan10Seconds}
                                    handleAskAI={handleAskAI}
                                    aiResponse={aiResponse}
                                    aiLoading={aiLoading[question._id] || false}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <MessageSquarePlus className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No answered questions found</h3>
                                <p className="mt-1 text-muted-foreground">
                                    {activeSubject !== 'All' || searchTerm
                                        ? 'Try adjusting your filters or search criteria'
                                        : 'No questions have been answered yet'}
                                </p>
                                {(searchTerm || activeSubject !== 'All') && (
                                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </TabsContent> */}
                </Tabs>
            </div>

            {/* Answer Dialog */}
            <Dialog open={openAnswerDialog} onOpenChange={setOpenAnswerDialog}>
                <DialogContent className="sm:max-w-md p-5">
                    <DialogHeader>
                        <DialogTitle>Answer Question</DialogTitle>
                        <DialogDescription>
                            Share your knowledge to help another student
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Textarea
                                id="answer"
                                placeholder="Write your answer here..."
                                rows={6}
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                className="resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenAnswerDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={submitAnswer}
                            disabled={loading}
                            className="bg-gray-600 hover:bg-scholar-700"
                        >
                            {loading ? (<><Loader2 className="animate-spin h-4 w-4 mr-2" /> Submitting ... </>

                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Question Dialog */}
            <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] h-[80vh] flex flex-col p-8">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{viewedQuestion?.title}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2">
                            Posted by {viewedQuestion?.author?.name} • {viewedQuestion?.timestamp}
                            <div className="flex flex-wrap gap-1 mt-2">
                                <Badge variant="outline">{viewedQuestion?.subject}</Badge>
                                <Badge variant="outline">{viewedQuestion?.topic}</Badge>
                                {viewedQuestion?.hasAiResponse && (
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 flex items-center">
                                        <Bot className="h-3 w-3 mr-1" />
                                        AI Help
                                    </Badge>
                                )}
                                {viewedQuestion?.answers && (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                        Solved
                                    </Badge>
                                )}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-muted/30 dark:bg-muted/10 p-2 rounded-md my-2 font-bold">
                        <p className="text-foreground">Description: {viewedQuestion?.body}</p>
                    </div>
                    {/* Answers Section */}
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <h3 className="text-lg font-medium mb-2">
                            Answers ({viewedQuestion?.comments?.length || 0})
                        </h3>

                        {/* View answers */}
                        {/* <div className="overflow-y-auto  pr-4 -mr-4">
                            <div className="space-y-4">
                                {viewedQuestion?.comments && viewedQuestion.comments.length > 0 ? (
                                    viewedQuestion.comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className={`p-4 rounded-md ${comment.isAI
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50'
                                                : comment.isSolution
                                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50'
                                                    : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback
                                                            className={`${comment.isAI
                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                                }`}
                                                        >
                                                            {comment.author.initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-sm flex items-center gap-1">
                                                            {comment.author.name}
                                                            {comment.isAI && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                                                >
                                                                    AI
                                                                </Badge>
                                                            )}
                                                            {comment.isSolution && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                                >
                                                                    Solution
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {comment.timestamp}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p
                                                className="ai-message mt-4 text-sm"
                                                dangerouslySetInnerHTML={{ __html: comment.text.replace(/\n/g, "") }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground">
                                        No answers yet. Be the first to answer or ask AI!
                                    </div>
                                )}
                            </div>
                        </div> */}
                        <div className="overflow-y-auto pr-4 -mr-4">
                            <div className="space-y-4">
                                {viewedQuestion?.comments && viewedQuestion.comments.length > 0 ? (
                                    viewedQuestion.comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className={`p-4 rounded-md ${comment.isAI
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50'
                                                : comment.isSolution
                                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50'
                                                    : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback
                                                            className={`${comment.isAI
                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                                }`}
                                                        >
                                                            {comment.isAI ? 'AI' : comment.author.initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-sm flex items-center gap-1">
                                                            {comment.isAI ? 'AI Assistant' : comment.author.name}
                                                            {comment.isAI && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                                                >
                                                                    AI
                                                                </Badge>
                                                            )}
                                                            {comment.isSolution && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                                >
                                                                    Solution
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{comment.timestamp}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p
                                                className="ai-message mt-4 text-sm"
                                                dangerouslySetInnerHTML={{ __html: comment.text.replace(/\n/g, '') }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground">
                                        No answers yet. Be the first to answer or ask AI!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </DialogContent>
            </Dialog>

        </div>
    )
}

export default Doubts