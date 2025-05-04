import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bookmark, Clock, FileText, Search, View } from 'lucide-react';
import Navbar from '@/components/Navbar';
import UploadNotes from '@/components/UploadNotes';
import apiService from '@/services/api';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Notes = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [notes, setNotes] = useState([]);
  const data = useSelector(state => state.auth);
  const user = data.user;

  const fetchNotes = async () => {
    try {
      const data = await apiService.notes.getByUserId(user._id);
      setNotes(data);
    } catch (error) {
      toast.error('Failed to fetch notes!');
    }
  };

  const RenderFile = ({ file }) => {
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
      setNumPages(numPages);
    };

    if (file.mimeType.includes("pdf")) {
      return (
        <div className="pdf-container">
          <Document file={file.url} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} width={400} />
            ))}
          </Document>
        </div>
      );
    } else {
      return <img src={file.url} alt={file.fileName} className="max-w-full h-auto" />;
    }
  };

  // Get notes from the server
  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUploadSuccess = () => {
    fetchNotes();
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'bookmarked') return matchesSearch && note.bookmarked;
    return matchesSearch && note.subject.toLowerCase() === activeTab.toLowerCase();
  });


  const toggleBookmark = async (id) => {
    try {
      //This is just to show user instant update of bookmark , real update will be done in the api call
      const updatedNotes = notes.map(note =>
        note._id === id ? { ...note, bookmarked: !note.bookmarked } : note
      );
      setNotes(updatedNotes);
      const updatedNote = await apiService.notes.toggleBookmark(id);
      setNotes(notes.map(note =>
        note._id === id ? updatedNote : note
      ));

      toast.success('Bookmark toggled!');
    } catch (error) {
      setNotes(notes);
      toast.error('Failed to toggle bookmark!');
    }
  };

  const subjectTabs = ["All", "Mathematics", "Physics", "English", "Biology", "Chemistry", "Computer Science", "Bookmarked"];


  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pb-20 md:pb-6 pt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Class Notes</h1>
            <p className="text-muted-foreground">Share and access notes from your classmates</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <UploadNotes onUploadSuccess={handleUploadSuccess} />
            </div>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setActiveTab}>
          <div className="overflow-x-auto pb-2">
            <TabsList className="h-full">
              {subjectTabs.map((tab) => (
                <TabsTrigger
                  key={tab.toLowerCase()}
                  value={tab.toLowerCase()}
                  className="px-4"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {subjectTabs.map((tab) => (
            <TabsContent key={tab.toLowerCase()} value={tab.toLowerCase()} className="mt-4">
              {filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredNotes.map((note) => (
                    <Card key={note._id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{note.title}</CardTitle>
                            <CardDescription>{note.subject}</CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={note.bookmarked ? "text-yellow-500" : "text-muted-foreground"}
                            onClick={() => toggleBookmark(note._id)}
                          >
                            <Bookmark className="h-5 w-5" fill={note.bookmarked ? "currentColor" : "none"} />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{note.description}</p>
                      </CardHeader>
                      <CardContent>

                        {note.title && note.files.map(notes => (
                          <div className="flex items-center justify-between bg-muted/40 dark:bg-muted/20 p-2 rounded-md mb-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-scholar-600 dark:text-scholar-400" />
                              <span className="text-sm font-medium truncate max-w-[150px]">{notes.fileName}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{notes.fileSize}</span>
                          </div>
                        ))}

                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{note.dateUploaded} by {user.username}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full cursor-pointer">
                              <View className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl p-4 cursor-pointer">
                            <DialogHeader>
                              <DialogTitle>{note.title}</DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-muted-foreground">{note.description}</p>
                            <Swiper
                              modules={[Navigation, Pagination]}
                              navigation
                              pagination={{ clickable: true }}
                              spaceBetween={10}
                              slidesPerView={1}
                              className="w-full h-[500px]"
                            >
                              {note.files.map((file, index) => (
                                <SwiperSlide key={index}>
                                  <div className="flex justify-center items-center h-full">
                                    <RenderFile file={file} />
                                  </div>
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No notes found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery ? "Try adjusting your search terms" : "Be the first to share notes in this subject"}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

    </>
  )
}

export default Notes