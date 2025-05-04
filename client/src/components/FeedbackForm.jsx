import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, MessageSquarePlus, Star, Loader2 } from "lucide-react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import apiService from "@/services/api"
import { toast } from "sonner"
import { useSelector } from "react-redux"

export default function FeedbackForm() {
    const [subject, setSubject] = useState("")
    const [understanding, setUnderstanding] = useState("")
    const [rating, setRating] = useState("")
    const [feedback, setFeedback] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const data = useSelector(state => state.auth);
    const user = data.user;

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        if (!subject || !understanding || !rating || !feedback) {
            toast.error("Please fill in all fields")
            return
        }
        const studentId = user._id;
        try {
            await apiService.feedback.submit({
                studentId,
                subject,
                understanding,
                rating,
                feedback
            })
            toast.success("Feedback submitted successfully")

            // Reset form
            setSubject("")
            setUnderstanding("")
            setRating("")
            setFeedback("")
        } catch (error) {
            toast.error("Failed to submit feedback")
            console.error("Error submitting feedback:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <div className="absolute -top-3 -right-3 z-10">
                <motion.div
                    initial={{ rotate: 0, scale: 0.8 }}
                    animate={{ rotate: [0, 15, -15, 0], scale: [0.8, 1.2, 0.8] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                >
                    <Sparkles className="h-6 w-6 text-yellow-400" />
                </motion.div>
            </div>

            <Card className="border-2 border-scholar-200 dark:border-scholar-800 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-scholar-100 to-transparent dark:from-scholar-900/30 dark:to-transparent rounded-bl-full z-0 " />

                <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-2 text-scholar-700 dark:text-scholar-300">
                        <MessageSquarePlus className="h-5 w-5 text-scholar-600 dark:text-scholar-400" />
                        Daily Class Feedback
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Your feedback helps us improve the learning experience!
                    </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            {/* Subject */}
                            <div className="grid gap-2">
                                <Label htmlFor="subject" className="text-scholar-700 dark:text-scholar-300">
                                    Subject
                                </Label>
                                <Select value={subject} onValueChange={setSubject}>
                                    <SelectTrigger id="subject" className="border-scholar-200 dark:border-scholar-800 cursor-pointer">
                                        <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                        <SelectItem value="Science">Science</SelectItem>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="History">History</SelectItem>
                                        <SelectItem value="Computer">Computer Science</SelectItem>
                                        <SelectItem value="Physics">Physics</SelectItem>
                                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                                        <SelectItem value="Biology">Biology</SelectItem>
                                        <SelectItem value="Geography">Geography</SelectItem>
                                        <SelectItem value="Economics">Economics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Understanding Level */}
                            <div className="grid gap-2">
                                <Label htmlFor="understanding" className="text-scholar-700 dark:text-scholar-300">
                                    Understanding Level
                                </Label>
                                <Select value={understanding} onValueChange={setUnderstanding}>
                                    <SelectTrigger id="understanding" className="border-scholar-200 dark:border-scholar-800 cursor-pointer">
                                        <SelectValue placeholder="How well did you understand?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="excellent">Excellent - Understood everything</SelectItem>
                                        <SelectItem value="good">Good - Understood most concepts</SelectItem>
                                        <SelectItem value="fair">Fair - Understood some parts</SelectItem>
                                        <SelectItem value="poor">Poor - Had trouble understanding</SelectItem>
                                        <SelectItem value="very-poor">Very Poor - Did not understand at all</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Rating */}
                            <motion.div className="grid gap-2" whileHover={{ scale: 1.02 }}>
                                <Label className="text-scholar-700 dark:text-scholar-300">Rate today's class</Label>
                                <RadioGroup
                                    value={rating}
                                    onValueChange={setRating}
                                    className="flex justify-between items-center py-2"
                                >
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <motion.div
                                            key={value}
                                            className="flex flex-col items-center gap-1"
                                            whileHover={{ scale: 1.2, y: -5 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <RadioGroupItem
                                                value={value.toString()}
                                                id={`rating-${value}`}
                                                className="sr-only"
                                            />
                                            <label htmlFor={`rating-${value}`} className="cursor-pointer flex flex-col items-center">
                                                <Star
                                                    className={`h-8 w-8 transition-all duration-200 ${parseInt(rating) >= value
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300 dark:text-gray-600"
                                                        }`}
                                                />
                                                <span className="text-xs mt-1">{value}</span>
                                            </label>
                                        </motion.div>
                                    ))}
                                </RadioGroup>
                            </motion.div>

                            {/* Feedback Textarea */}
                            <div className="grid gap-2">
                                <Label htmlFor="feedback" className="text-scholar-700 dark:text-scholar-300">
                                    Your Feedback
                                </Label>
                                <Textarea
                                    id="feedback"
                                    placeholder="Share your thoughts about today's class..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="resize-none border-scholar-200 dark:border-scholar-800 min-h-[100px]"
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4">
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    type="submit"
                                    className="w-full bg-gray-800 hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> "Submitting..."</> : "Submit Feedback"}
                                </Button>
                            </motion.div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
