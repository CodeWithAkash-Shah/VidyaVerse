import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import apiService from "@/services/api";
import { useSelector } from "react-redux";

const UploadNotes = ({ onUploadSuccess }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subject, setSubject] = useState("");
    const [files, setFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const data = useSelector(state => state.auth);
    const user = data.user;
    const [open, setOpen] = useState(false);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 10) {
            toast.error("You can upload a maximum of 10 files.");
            return;
        }
        setFiles((prev) => [...prev, ...selectedFiles]);
        setFileNames((prev) => [
            ...prev,
            ...selectedFiles.map((file) => file.name),
        ]);
    };

    const validateForm = () => {
        if (!title.trim()) return "Title is required";
        if (!subject.trim()) return "Subject is required";
        if (!description.trim()) return "Description is required";
        if (files.length === 0) return "Please attach at least one file";
        return null;
    };

    const handleSubmit = async () => {
        const errorMsg = validateForm();
        if (errorMsg) {
            toast.error(errorMsg);
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("subject", subject);
        formData.append("username", user.username);
        files.forEach((file) => formData.append("files", file));

        try {
            const result = await apiService.notes.upload(formData);
            toast("✅ Note uploaded successfully!");
            console.log("Uploaded:", result);

            // Reset form
            setTitle("");
            setDescription("");
            setSubject("");
            setFiles([]);
            setFileNames([]);
            setOpen(false);
            if (onUploadSuccess) onUploadSuccess(result);
        } catch (err) {
            console.error("Error:", err);
            toast("❌ Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="cursor-pointer" onClick={() => setOpen(true)}>
                        Upload Note
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-5">
                    <DialogHeader>
                        <DialogTitle>Upload a New Note</DialogTitle>
                        <DialogDescription>
                            Fill in the details and attach files for your note
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label className="py-2" htmlFor="title">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter the note title"
                            />
                        </div>
                        <div>
                            <Label className="py-2" htmlFor="subject">
                                Subject
                            </Label>
                            <Input
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter the subject of the note"
                            />
                        </div>
                        <div>
                            <Label className="py-2" htmlFor="description">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter the note description"
                            />
                        </div>
                        <div>
                            <Label className="py-2">Attach Files</Label>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex items-center relative overflow-hidden"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Choose Files
                                <Input
                                    type="file"
                                    accept="application/pdf,image/*"
                                    multiple
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                            </Button>
                            {fileNames.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm">Selected Files:</p>
                                    <ul className="text-sm text-muted-foreground">
                                        {fileNames.map((name, index) => (
                                            <li key={index}>{name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                                You can attach up to 10 PDFs or images
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" className="cursor-pointer" onClick={handleSubmit}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Upload Note"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UploadNotes;