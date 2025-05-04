import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronRight, FileText, Filter, Trophy } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import apiService from '@/services/api';
import EventCard from '@/components/EventCard';

const Events = () => {
  const data = useSelector(state => state.auth);
  const user = data.user;
  const navigate = useNavigate();
  const [userType, setUserType] = useState(user?.role || 'student');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('India');
  const [selectedQuery, setSelectedQuery] = useState('Hackathons');

  // Search options
  const options = [
    { label: 'Hackathons', query: 'Hackathons', type: 'competition', category: 'Technology' },
    { label: 'Developer Events', query: 'Developer events', type: 'event', category: 'Technology' },
    { label: 'Coding Competitions', query: 'Coding competitions', type: 'competition', category: 'Programming' },
    { label: 'Tech Fests', query: 'Tech fests', type: 'event', category: 'Technology' },
    { label: 'Scholarships', query: 'Student scholarships', type: 'event', category: 'Education' },
    { label: 'Conferences', query: 'Tech conferences', type: 'event', category: 'Technology' },
    { label: 'Workshops', query: 'Student workshops', type: 'event', category: 'Education' },
  ];

  // City options
  const cities = [
    'India', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Indore'
  ];

  // Fetch events using apiService
  const handleSearch = async (query, type, category) => {
    const searchQuery = `${query} in ${selectedCity}`;
    setLoading(true);
    try {
      const response = await apiService.search.getEvents(searchQuery);
      // Map API response to event structure
      const mappedEvents = response.map((item, index) => ({
        id: index + 1,
        title: item.title,
        description: item.snippet,
        date: 'TBD', // API doesn't provide date
        type: type || 'event',
        category: category || 'General',
        link: item.link,
      }));
      setEvents(mappedEvents);
    } catch (error) {
      toast.error('Failed to fetch events: ' + error.message);
    }
    setLoading(false);
  };

  // Trigger search when city or query changes
  useEffect(() => {
    const option = options.find(opt => opt.query === selectedQuery);
    handleSearch(option.query, option.type, option.category);
  }, [selectedCity, selectedQuery]);

  // Get all unique categories
  const categories = [...new Set(events.map(event => event.category))];

  // Filter events based on category and type
  const filterEvents = (events, type = null) => {
    return events.filter(event =>
      (type ? event.type === type : true) &&
      (selectedCategory ? event.category === selectedCategory : true)
    );
  };

  // Navigate to event details page
  const handleLearnMore = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 pb-20 md:pb-6 pt-4">
        {userType === 'student' && (
          <>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/10 rounded-xl p-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Events & Competitions</h1>
              <p className="text-gray-600 dark:text-gray-300">Discover exciting opportunities to learn and participate</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="rounded-full border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedQuery} onValueChange={setSelectedQuery}>
                <SelectTrigger className="rounded-full border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {options.map(option => (
                    <SelectItem key={option.query} value={option.query}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="rounded-full border-gray-200 dark:border-gray-700 font-medium">
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedCategory || "Filter"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="end">
                  <div className="grid gap-2">
                    <Button
                      variant={selectedCategory === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                    >
                      All Categories
                    </Button>
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                {/* <TabsList className="w-full grid grid-cols-4 rounded-full p-1 bg-gray-100 dark:bg-gray-800">
                  <TabsTrigger value="all" className="rounded-full">All</TabsTrigger>
                  <TabsTrigger value="events" className="rounded-full">Events</TabsTrigger>
                  <TabsTrigger value="competitions" className="rounded-full">Competitions</TabsTrigger>
                  <TabsTrigger value="exams" className="rounded-full">Exams</TabsTrigger>
                </TabsList> */}

                <TabsContent value="all" className="mt-6 space-y-4">
                  {filterEvents(events).map(event => (
                    <EventCard
                      key={event.id}
                      event={{
                        ...event,
                        id: event.id,
                        onLearnMore: () => handleLearnMore(event.id)
                      }}
                    />
                  ))}
                  {filterEvents(events).length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">No events found for the selected criteria.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="events" className="mt-6 space-y-4">
                  {filterEvents(events, 'event').map(event => (
                    <EventCard
                      key={event.id}
                      event={{
                        ...event,
                        id: event.id,
                        onLearnMore: () => handleLearnMore(event.id)
                      }}
                    />
                  ))}
                  {filterEvents(events, 'event').length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">No events found for the selected criteria.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="competitions" className="mt-6 space-y-4">
                  {filterEvents(events, 'competition').map(event => (
                    <EventCard
                      key={event.id}
                      event={{
                        ...event,
                        id: event.id,
                        onLearnMore: () => handleLearnMore(event.id)
                      }}
                    />
                  ))}
                  {filterEvents(events, 'competition').length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">No competitions found for the selected criteria.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="exams" className="mt-6 space-y-4">
                  {filterEvents(events, 'exam').map(event => (
                    <EventCard
                      key={event.id}
                      event={{
                        ...event,
                        id: event.id,
                        onLearnMore: () => handleLearnMore(event.id)
                      }}
                    />
                  ))}
                  {filterEvents(events, 'exam').length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">No exams found for the selected criteria.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </>
        )
        }
      </div>
    </div>
  );
};

export default Events;