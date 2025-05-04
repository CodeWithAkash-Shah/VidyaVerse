import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import apiService from "../services/api";
import { toast } from "sonner";

const TeacherFeedbackSummary = () => {
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const teacherId = useSelector((state) => state.auth.user._id);

  const handleSummarize = async () => {
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await apiService.gemini.summarizeClass(className, {
        teacherId,
        subject,
      });
      setSummary(response.summary);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select value={className} onValueChange={setClassName}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Class 10</SelectItem>
                <SelectItem value="11">Class 11</SelectItem>
                <SelectItem value="12">Class 12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSummarize} disabled={loading} className="w-full">
            {loading ? 'Loading...' : 'Get Feedback Summary'}
          </Button>

          {error && <p className="text-destructive">{error}</p>}

          {summary && (
            <div
              className="prose prose-sm mt-4"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherFeedbackSummary;
