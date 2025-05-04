// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"

// import { Badge } from '@/components/ui/badge';
// import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import {
//     ChevronRight,
//     MessageCircle, MessageSquarePlus
// } from 'lucide-react';
// import FeedbackForm from '@/components/FeedbackForm'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent } from '@/components/ui/card';
// import EventCard from "@/components/EventCard"
// import apiService from "@/services/api";
// import { toast } from "sonner";

// export default function StudentDashboard({user}) {
//     const [RecentQuestions, setRecentQuestions] = useState([]);

//     const upcomingEvents = [
//         {
//             id: 1,
//             title: "Science Exhibition",
//             description: "Annual science fair showcasing student projects from various scientific disciplines.",
//             date: "April 15, 2025",
//             type: "event",
//             category: "Science",
//         },
//         {
//             id: 2,
//             title: "Math Olympiad",
//             description: "National-level mathematics competition for high school students.",
//             date: "April 22, 2025",
//             type: "competition",
//             category: "Mathematics",
//         },
//         {
//             id: 3,
//             title: "Mid-term Examinations",
//             description: "Mid-semester examinations for all subjects.",
//             date: "April 25-30, 2025",
//             type: "exam",
//             category: "Academic",
//         },
//     ];

//     // fetching all questions
//     const fetchRecentDoubts = async () => {
//         try {
//             await apiService.doubts.getAllDoubts(user.class).then((data) => {
//                 const lastThree = data.slice(-3);
//                 setRecentQuestions(lastThree);
//             });
//         } catch (error) {
//             console.error("Error fetching doubts:", error);
//             toast.error("Failed to fetch doubts. Please try again later.");
//         }

//     }

//     useEffect(() => {
//         fetchRecentDoubts()
//     }, [])

//     return (
//         <div className="p-6 max-w-7xl mx-auto">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//                 <h1 className="text-2xl font-bold">Welcome, {user?.username} 👋</h1>
//                 <div className="flex items-center gap-3 mt-2 sm:mt-0">
//                     <Badge className="bg-scholar-100 text-scholar-700 dark:bg-scholar-900/30 dark:text-scholar-300 text-sm">
//                         Spring Semester 2025
//                     </Badge>
//                     <Dialog>
//                         <DialogTrigger asChild>
//                             <Button variant="outline" className=" cursor-pointer flex items-center gap-2 border-scholar-200 bg-scholar-50 hover:bg-scholar-100 dark:border-scholar-700 dark:bg-scholar-900/50 dark:hover:bg-scholar-900 text-scholar-700 dark:text-scholar-300">
//                                 <MessageSquarePlus className="h-4 w-4" />
//                                 Daily Feedback
//                             </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-md">
//                             <FeedbackForm />
//                         </DialogContent>
//                     </Dialog>
//                 </div>
//             </div>

//             <Tabs defaultValue="overview" className="mb-6">
//                 <TabsList>
//                     <TabsTrigger value="overview">Recent Doubts</TabsTrigger>
//                     <TabsTrigger value="schedule">My Schedule</TabsTrigger>
//                     <TabsTrigger value="assignments">Assignments</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="overview" className="mt-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="md:col-span-2">
//                             <div className="mt-6">
//                                 <div className="flex justify-between items-center mb-4">
//                                     <h2 className="text-lg font-semibold mb-0">Recent Doubts</h2>
//                                     <Button variant="ghost" className="text-scholar-600 dark:text-scholar-400" asChild>
//                                         <Link to="/doubts">
//                                             View All <ChevronRight className="h-4 w-4 ml-1" />
//                                         </Link>
//                                     </Button>
//                                 </div>

//                                 <div className="grid gap-4">
//                                     {RecentQuestions.map((doubt) => (
//                                         <Card key={doubt.id} className="hover:shadow-md transition-shadow">
//                                             <CardContent className="px-4">
//                                                 <div className="flex justify-between items-start">
//                                                     <div>
//                                                         <div className="flex items-center gap-2">
//                                                             <MessageCircle className="h-4 w-4 text-scholar-600 dark:text-scholar-400" />
//                                                             <h3 className="font-medium">{doubt.title}</h3>
//                                                         </div>
//                                                         <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
//                                                             <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">{doubt.subject}</Badge>
//                                                             <span>{new Date(doubt.createdAt).toLocaleString()}</span>
//                                                         </div>
//                                                     </div>
//                                                     <div className="text-right">
//                                                         <span className="text-sm font-medium">{doubt.answers.length} Replies</span>
//                                                     </div>
//                                                 </div>
//                                             </CardContent>
//                                         </Card>
//                                     ))}
//                                 </div>

//                                 <Button className="w-full mt-4" variant="outline" asChild>
//                                     <Link to="/ask-question">Ask a New Question</Link>
//                                 </Button>
//                             </div>
//                         </div>

//                         <div>
//                             <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
//                             <div className="space-y-4">
//                                 {upcomingEvents.map((event) => (
//                                     <EventCard key={event.id} event={event} />
//                                 ))}
//                             </div>
//                             <Button className="w-full mt-4" variant="outline" asChild>
//                                 <Link to="/events">View All Events</Link>
//                             </Button>
//                         </div>
//                     </div>
//                 </TabsContent>

//                 <TabsContent value="schedule">
//                     <div className="p-8 text-center">
//                         <h3 className="text-lg font-medium mb-2">Weekly Schedule Content</h3>
//                         <p className="text-gray-500 dark:text-gray-400">Your class schedule for the current week will appear here.</p>
//                     </div>
//                 </TabsContent>

//                 <TabsContent value="assignments">
//                     <div className="p-8 text-center">
//                         <h3 className="text-lg font-medium mb-2">Assignments Content</h3>
//                         <p className="text-gray-500 dark:text-gray-400">Your pending and completed assignments will appear here.</p>
//                     </div>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     )
// }


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, MessageCircle, MessageSquarePlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import FeedbackForm from '@/components/FeedbackForm';
import EventCard from "@/components/EventCard";
import apiService from "@/services/api";
import { toast } from "sonner";

export default function StudentDashboard({ user }) {
  const [RecentQuestions, setRecentQuestions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Fetch recent doubts
  const fetchRecentDoubts = async () => {
    try {
      const data = await apiService.doubts.getAllDoubts(user.class);
      const lastThree = data.slice(-5);
      setRecentQuestions(lastThree);
    } catch (error) {
      console.error("Error fetching doubts:", error);
      toast.error("Failed to fetch doubts. Please try again later.");
    }
  };

  // Fetch Hackathons in Indore
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await apiService.search.getEvents("Hackathons in Indore");
      const mappedEvents = response.slice(0, 3).map((item, index) => ({
        id: index + 1,
        title: item.title,
        description: item.snippet,
        date: "TBD",
        type: "competition",
        category: "Technology",
        link: item.link,
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events: " + error.message);
    }
    setLoadingEvents(false);
  };

  useEffect(() => {
    fetchRecentDoubts();
    fetchEvents();
  }, []);

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.username} 👋</h1>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <Badge className="bg-scholar-100 text-scholar-700 dark:bg-scholar-900/30 dark:text-scholar-300 text-sm">
            Spring Semester 2025
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="cursor-pointer flex items-center gap-2 border-scholar-200 bg-scholar-50 hover:bg-scholar-100 dark:border-scholar-700 dark:bg-scholar-900/50 dark:hover:bg-scholar-900 text-scholar-700 dark:text-scholar-300">
                <MessageSquarePlus className="h-4 w-4" />
                Daily Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <FeedbackForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Recent Doubts</TabsTrigger>
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold mb-0">Recent Doubts</h2>
                  <Button variant="ghost" className="text-scholar-600 dark:text-scholar-400" asChild>
                    <Link to="/doubts">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>

                <div className="grid gap-4">
                  {RecentQuestions.map((doubt) => (
                    <Card key={doubt.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="px-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4 text-scholar-600 dark:text-scholar-400" />
                              <h3 className="font-medium">{doubt.title}</h3>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                              <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">{doubt.subject}</Badge>
                              <span>{new Date(doubt.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">{doubt.answers.length} Replies</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link to="/ask-question">Ask a New Question</Link>
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
              {loadingEvents ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                  {events.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center">No events found.</p>
                  )}
                </div>
              )}
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link to="/events">View All Events</Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Weekly Schedule Content</h3>
            <p className="text-gray-500 dark:text-gray-400">Your class schedule for the current week will appear here.</p>
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Assignments Content</h3>
            <p className="text-gray-500 dark:text-gray-400">Your pending and completed assignments will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
