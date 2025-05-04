// import React, { useState } from 'react';
// import { Calendar, Trophy, BookOpen, MapPin, Clock, Globe, Users } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Link } from 'react-router-dom';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// import { toast } from 'sonner';

// const EventCard = ({ event }) => {
//   const [showDetailsDialog, setShowDetailsDialog] = useState(false);

//   const getEventIcon = () => {
//     switch (event.type) {
//       case 'competition':
//         return <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />;
//       case 'exam':
//         return <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
//       default:
//         return <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
//     }
//   };

//   const getEventColor = () => {
//     switch (event.type) {
//       case 'competition':
//         return 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
//       case 'exam':
//         return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
//       default:
//         return 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
//     }
//   };

//   const handleLearnMore = () => {
//     if (event.onLearnMore) {
//       event.onLearnMore();
//     } else {
//       setShowDetailsDialog(true);
//     }
//   };

//   const handleRegister = () => {
//     setShowDetailsDialog(false);
//     toast.success(`Registered for ${event.title} successfully!`);
//   };
//   return (
//     <>
//       <Card className="p-4 hover:shadow-md transition-shadow">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800">
//             {getEventIcon()}
//           </div>

//           <div className="flex-1">
//             <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-gray-100">{event.title}</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
//               </div>

//               <Badge className={`${getEventColor()} self-start sm:self-auto whitespace-nowrap`}>
//                 {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
//               </Badge>
//             </div>

//             <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm">{event.description}</p>

//             <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//               <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">
//                 {event.category}
//               </Badge>

//               <Button
//                 size="sm"
//                 className="w-full sm:w-auto cursor-pointer hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600"
//                 onClick={handleLearnMore}
//               >
//                 Details
//               </Button>
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Event Details Dialog */}
//       <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
//         <DialogContent className="sm:max-w-[550px] p-5">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               {getEventIcon()}
//               <span>{event.title}</span>
//             </DialogTitle>
//             <DialogDescription>
//               {event.date}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             <Badge className={`${getEventColor()}`}>
//               {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
//             </Badge>

//             <div className="text-gray-700 dark:text-gray-300">
//               <p className="mb-4">{event.description}</p>

//               <div className="space-y-2 mt-4">
//                 {event.time && (
//                   <div className="flex items-center gap-2">
//                     <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
//                     <span className="text-sm">{event.time}</span>
//                   </div>
//                 )}

//                 {event.location && (
//                   <div className="flex items-center gap-2">
//                     <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
//                     <span className="text-sm">{event.location}</span>
//                   </div>
//                 )}

//                 {event.organizer && (
//                   <div className="flex items-center gap-2">
//                     <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
//                     <span className="text-sm">Organized by: {event.organizer}</span>
//                   </div>
//                 )}

//                 <div className="flex items-center gap-2">
//                   <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
//                   <span className="text-sm">Category: {event.category}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
//               <h4 className="text-sm font-medium mb-2">Additional Information</h4>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 Join this {event.type} to enhance your learning experience and connect with peers who share similar interests. Don't miss this opportunity!
//               </p>
//             </div>
//           </div>

//           <DialogFooter className="flex gap-2 sm:gap-0 cursor-pointer">
//             <Button
//               variant="outline"
//               onClick={() => setShowDetailsDialog(false)}
//             >
//               Close
//             </Button>

//             {event.type === 'competition' || event.type === 'event' ? (
//               <Button
//                 onClick={handleRegister}
//                 className="mx-3 cursor-pointer hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600"
//               >
//                 Register Now
//               </Button>
//             ) : (
//               <Link to={`/events/${event.id}`}>
//                 <Button
//                   className="mx-3 cursor-pointer hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600"
//                 >
//                   View Details
//                 </Button>
//               </Link>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

// export default EventCard

import React, { useState } from 'react';
import { Calendar, Trophy, BookOpen, MapPin, Clock, Globe, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const EventCard = ({ event }) => {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const getEventIcon = () => {
    switch (event.type) {
      case 'competition':
        return <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'exam':
        return <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getEventColor = () => {
    switch (event.type) {
      case 'competition':
        return 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'exam':
        return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
    }
  };

  const handleLearnMore = () => {
      setShowDetailsDialog(true);
  };

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800">
            {getEventIcon()}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{event.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
              </div>

              <Badge className={`${getEventColor()} self-start sm:self-auto whitespace-nowrap`}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
            </div>

            <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm">{event.description}</p>

            <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">
                {event.category}
              </Badge>

              <Button
                size="sm"
                className="w-full sm:w-auto cursor-pointer hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600"
                onClick={handleLearnMore}
              >
                Details
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[550px] p-7">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getEventIcon()}
              <span>{event.title}</span>
            </DialogTitle>
            <DialogDescription>
              {event.date}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Badge className={`${getEventColor()}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>

            <div className="text-gray-700 dark:text-gray-300">
              <p className="mb-4 text-sm">{event.description}</p>

              <div className="space-y-2 mt-4">
                {event.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                )}

                {event.organizer && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm">Organized by: {event.organizer}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm">Category: {event.category}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Additional Information</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Join this {event.type} to enhance your learning experience and connect with peers who share similar interests. Don't miss this opportunity!
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0 cursor-pointer">
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
            >
              Close
            </Button>

            {event.link && (
              <Button
                asChild
                className="mx-3 cursor-pointer hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600"
              >
                <a href={event.link} target="_blank" rel="noopener noreferrer">
                  View Details
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;