import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Bot, CheckCircle2, Award, Loader2, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const QuestionCard = ({
  question,
  onAnswer,
  onView,
  isQuestionOlderThan10Seconds,
  handleAskAI,
  aiLoading,
  user,
}) => {
  const [timeLeft, setTimeLeft] = useState(null);

  // Calculate time left for the 10-second timer
  useEffect(() => {
    if (!question.createdAt || isQuestionOlderThan10Seconds(question.createdAt)) {
      setTimeLeft(0);
      return;
    }

    const createdTime = new Date(question.createdAt).getTime();
    const currentTime = new Date().getTime();
    const diffSeconds = Math.max(10 - (currentTime - createdTime) / 1000, 0);
    setTimeLeft(Math.ceil(diffSeconds));

    if (diffSeconds > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [question.createdAt, isQuestionOlderThan10Seconds]);

  const getBadgeColor = (type) => {
    switch (type) {
      case 'expert':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'teacher':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'totalAnswers':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'author':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'helper':
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'expert':
        return <Award className="h-3 w-3 mr-1" />;
      case 'teacher':
        return <MessageSquare className="h-3 w-3 mr-1" />;
      case 'totalAnswers':
        return <MessageSquare className="h-3 w-3 mr-1" />; // You can change to another icon if you want
      case 'author':
        return <User className="h-3 w-3 mr-1" />;
      case 'helper':
      default:
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
    }
  };


  const handleViewDetails = () => {
    if (onView) {
      onView();
    }
  };

  const HandleAnswerAI = () => {
    if (handleAskAI) {
      handleAskAI(question);
    }
  };
  
  return (
    <Card className="rounded-lg overflow-hidden hover:shadow-md transition-shadow">
    <div className="p-4 border-b dark:border-gray-700 bg-card dark:bg-gray-800">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {question.title}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* Subject and Topic */}
            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-700">
              {question.subject}
            </Badge>
            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-700">
              {question.topic}
            </Badge>
  
            {/* AI Help Badge */}
            {question.hasAiResponse && (
              <Badge className="flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <Bot className="h-3 w-3 mr-1" />
                AI Help
              </Badge>
            )}
  
            {/* Solved Badge */}
            {question.isSolved && (
              <Badge className="flex items-center bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Solved
              </Badge>
            )}
  
            {/* Answer Badge */}
            {question.answerBadge && (
              <Badge className={`flex items-center ${getBadgeColor(question.answerBadge.type)}`}>
                {getBadgeIcon(question.answerBadge.type)}
                {question.answerBadge.name}
              </Badge>
            )}
  
            {/* Total Answers Badge */}
            {question.answers?.length > 0 && (
              <Badge className={`flex items-center ${getBadgeColor('totalAnswers')}`}>
                {getBadgeIcon('totalAnswers')}
                {question.answers.length} Answers
              </Badge>
            )}
  
            {/* Author Badge */}
            {question.author && (
              <Badge className={`flex items-center ${getBadgeColor('author')}`}>
                {getBadgeIcon('author')}
                {question.author.username}
              </Badge>
            )}
          </div>
        </div>
  
        {/* Avatar */}
        <Avatar className="h-10 w-10">
          {question?.author?.avatar ? (
            <img src={question.author.avatar} alt={question.author.username} />
          ) : (
            <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {question?.author?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
  
      {/* Question Body */}
      <p className="mt-3 text-gray-700 dark:text-gray-300 line-clamp-2">
        {question.body}
      </p>
    </div>
  
    {/* Bottom Buttons */}
    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/60 flex justify-between items-center">
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span>{new Date(question.createdAt).toLocaleString()}</span>
        {timeLeft > 0 && user?._id === question?.author?._id && (
          <span className="text-xs text-gray-600 dark:text-gray-400">
            AI available in {timeLeft}s
          </span>
        )}
      </div>
  
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="text-xs" onClick={handleViewDetails}>
          View
        </Button>
  
        {timeLeft === 0 && !question?.hasAiResponse && user?._id === question?.author?._id && (
          <Button
            onClick={HandleAnswerAI}
            disabled={aiLoading}
            className="bg-purple-800 hover:bg-gray-700"
          >
            {aiLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Asking AI...
              </>
            ) : (
              <>
                <Bot className="h-4 w-4 mr-2" />
                Ask from AI
              </>
            )}
          </Button>
        )}
  
        <Button
          size="sm"
          className="text-xs hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600"
          onClick={onAnswer}
        >
          Answer
        </Button>
      </div>
    </div>
  </Card>
  
  );
};

export default QuestionCard;