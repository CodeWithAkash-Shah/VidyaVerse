
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, FileText, Users, Phone, Mail, MapPin, Building, BookType, Calendar, Globe, ShieldCheck, Award, School } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

// Form schema for sign in
const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Enhanced Form schema for sign up with additional fields
const signUpSchema = z.object({
  // Basic information - Step 1
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
  role: z.enum(["student", "teacher", "admin"]),

  // Student-specific fields - Step 2 for students
  grade: z.string().optional(),
  section: z.string().optional(),
  studentId: z.string().optional(),
  rollNumber: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  parentName: z.string().optional(),
  parentEmail: z.string().optional(),
  parentPhone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  gender: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
  achievements: z.string().optional(),
  previousSchool: z.string().optional(),
  transportMode: z.string().optional(),

  // Teacher-specific fields - Step 2 for teachers
  department: z.string().optional(),
  qualification: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  subjectsTaught: z.array(z.string()).optional(),
  specialization: z.string().optional(),
  teacherId: z.string().optional(),
  dateOfJoining: z.string().optional(),
  teachingLicense: z.string().optional(),
  preferredClassrooms: z.array(z.string()).optional(),
  teachingPhilosophy: z.string().optional(),
  availability: z.string().optional(),
  awards: z.string().optional(),
  publications: z.string().optional(),

  // Admin-specific fields - Step 2 for admins
  position: z.string().optional(),
  adminId: z.string().optional(),
  department_admin: z.string().optional(),
  accessLevel: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  certificationsHeld: z.array(z.string()).optional(),
  managementExperience: z.string().optional(),
  reportsTo: z.string().optional(),

  // Contact information - Step 3 for all roles
  phoneNumber: z.string().optional(),
  alternatePhoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),

  // Additional preferences - Step 4
  profilePictureUrl: z.string().optional(),
  prefersDarkMode: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  languagePreference: z.string().optional(),
  bio: z.string().optional(),

  // Terms and conditions acceptance
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Props interface
interface SignInSignUpProps {
  onSuccess?: (user: any) => void;
  onSignIn?: (values: z.infer<typeof signInSchema> & { role: 'student' | 'teacher' | 'admin' }) => Promise<any>;
  onSignUp?: (values: z.infer<typeof signUpSchema>) => Promise<any>;
  defaultRole?: 'student' | 'teacher' | 'admin';
  defaultTab?: 'signIn' | 'signUp';
}

const SignInSignUp: React.FC<SignInSignUpProps> = ({
  onSuccess,
  onSignIn,
  onSignUp,
  defaultRole = 'student',
  defaultTab = 'signIn'
}) => {
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>(defaultRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signUpStep, setSignUpStep] = useState<'basic' | 'role-specific' | 'contact' | 'preferences'>(
    'basic'
  );
  const { toast } = useToast();

  // Sign in form
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Sign up form
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: defaultRole,
      // Student fields
      grade: "",
      section: "",
      studentId: "",
      rollNumber: "",
      subjects: [],
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      dateOfBirth: "",
      bloodGroup: "",
      gender: "",
      hobbies: [],
      achievements: "",
      previousSchool: "",
      transportMode: "",
      // Teacher fields
      department: "",
      qualification: "",
      yearsOfExperience: "",
      subjectsTaught: [],
      specialization: "",
      teacherId: "",
      dateOfJoining: "",
      teachingLicense: "",
      preferredClassrooms: [],
      teachingPhilosophy: "",
      availability: "",
      awards: "",
      publications: "",
      // Admin fields
      position: "",
      adminId: "",
      department_admin: "",
      accessLevel: "",
      responsibilities: [],
      certificationsHeld: [],
      managementExperience: "",
      reportsTo: "",
      // Contact fields
      phoneNumber: "",
      alternatePhoneNumber: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      // Preferences
      profilePictureUrl: "",
      prefersDarkMode: false,
      emailNotifications: true,
      smsNotifications: false,
      languagePreference: "English",
      bio: "",
      termsAccepted: false
    },
  });

  // Available data selections
  // Grades
  const grades = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  // Sections
  const sections = ['A', 'B', 'C', 'D', 'E'];

  // Subjects
  const subjects = [
    'Mathematics', 'Science', 'English', 'Social Studies', 'Physics',
    'Chemistry', 'Biology', 'Computer Science', 'History', 'Geography',
    'Economics', 'Business Studies', 'Accounting', 'Art', 'Music',
    'Physical Education'
  ];

  // Departments
  const departments = [
    'Science', 'Mathematics', 'Languages', 'Social Sciences',
    'Arts', 'Physical Education', 'Administration'
  ];

  // Blood groups
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Genders
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  // Transport modes
  const transportModes = ['School Bus', 'Public Transport', 'Private Vehicle', 'Walking', 'Bicycle'];

  // Languages
  const languages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Mandarin', 'Arabic'];

  // Access levels
  const accessLevels = ['Level 1 (Basic)', 'Level 2 (Intermediate)', 'Level 3 (Advanced)', 'Level 4 (Full Access)'];

  // Hobbies
  const hobbiesList = [
    'Reading', 'Sports', 'Music', 'Art', 'Dancing', 'Coding', 'Photography',
    'Writing', 'Cooking', 'Gardening', 'Hiking', 'Swimming', 'Chess', 'Debating'
  ];

  // Handle sign in submission
  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      if (onSignIn) {
        const user = await onSignIn({ ...values, role });
        if (onSuccess) {
          onSuccess(user);
        }
      } else {
        // Default behavior for backward compatibility
        console.log("Sign In:", values, "Role:", role);
        toast({
          title: "Sign in successful",
          description: `Welcome back! You've signed in as a ${role}.`,
        });

        if (onSuccess) {
          onSuccess({ ...values, role });
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle sign up navigation
  const goToNextStep = () => {
    if (signUpStep === 'basic') {
      // Validate basic fields before proceeding
      signUpForm.trigger(['name', 'email', 'password', 'confirmPassword']);
      const hasErrors = !!signUpForm.formState.errors.name ||
        !!signUpForm.formState.errors.email ||
        !!signUpForm.formState.errors.password ||
        !!signUpForm.formState.errors.confirmPassword;

      if (!hasErrors) {
        setSignUpStep('role-specific');
      }
    } else if (signUpStep === 'role-specific') {
      setSignUpStep('contact');
    } else if (signUpStep === 'contact') {
      setSignUpStep('preferences');
    }
  };

  const goToPreviousStep = () => {
    if (signUpStep === 'role-specific') {
      setSignUpStep('basic');
    } else if (signUpStep === 'contact') {
      setSignUpStep('role-specific');
    } else if (signUpStep === 'preferences') {
      setSignUpStep('contact');
    }
  };

  // Handle sign up submission
  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      if (onSignUp) {
        const user = await onSignUp(values);
        if (onSuccess) {
          onSuccess(user);
        }
      } else {
        // Default behavior for backward compatibility
        console.log("Sign Up:", values);
        toast({
          title: "Account created",
          description: `Your ${values.role} account has been created successfully.`,
        });

        if (onSuccess) {
          onSuccess(values);
        }
      }
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update role in sign up form when role changes
  React.useEffect(() => {
    signUpForm.setValue("role", role);
  }, [role, signUpForm]);

  // Calculate progress percentage
  const calculateProgress = () => {
    switch (signUpStep) {
      case 'basic': return 25;
      case 'role-specific': return 50;
      case 'contact': return 75;
      case 'preferences': return 100;
      default: return 0;
    }
  };

  // Get step label
  const getStepLabel = () => {
    switch (signUpStep) {
      case 'basic': return 'Step 1: Basic Information';
      case 'role-specific': return `Step 2: ${role.charAt(0).toUpperCase() + role.slice(1)} Information`;
      case 'contact': return 'Step 3: Contact Information';
      case 'preferences': return 'Step 4: Preferences & Finish';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signIn">Sign In</TabsTrigger>
          <TabsTrigger value="signUp">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signIn">
          <Card className="border-border dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Sign In</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-sm font-medium mb-2 dark:text-gray-300">I am a:</div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={role === 'student' ? 'default' : 'outline'}
                    className={`flex flex-col items-center py-3 h-auto ${role === 'student'
                        ? 'bg-scholar-600 hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600 text-white'
                        : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    onClick={() => setRole('student')}
                    type="button"
                  >
                    <GraduationCap className="h-5 w-5 mb-1" />
                    <span className="text-xs">Student</span>
                  </Button>
                  <Button
                    variant={role === 'teacher' ? 'default' : 'outline'}
                    className={`flex flex-col items-center py-3 h-auto ${role === 'teacher'
                        ? 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white'
                        : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    onClick={() => setRole('teacher')}
                    type="button"
                  >
                    <FileText className="h-5 w-5 mb-1" />
                    <span className="text-xs">Teacher</span>
                  </Button>
                  <Button
                    variant={role === 'admin' ? 'default' : 'outline'}
                    className={`flex flex-col items-center py-3 h-auto ${role === 'admin'
                        ? 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white'
                        : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    onClick={() => setRole('admin')}
                    type="button"
                  >
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-xs">Admin</span>
                  </Button>
                </div>
              </div>

              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="youremail@example.com" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                        </FormControl>
                        <FormMessage className="dark:text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                        </FormControl>
                        <FormMessage className="dark:text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className={`w-full ${role === 'student'
                        ? 'bg-scholar-600 hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600'
                        : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Forgot your password? <a href="#" className="text-scholar-600 dark:text-scholar-400 hover:underline">Reset it here</a>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signUp">
          <Card className="border-border dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Create Account</CardTitle>
              <CardDescription className="dark:text-gray-300">
                {getStepLabel()}
              </CardDescription>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                <div className="bg-scholar-600 h-2.5 rounded-full dark:bg-scholar-500" style={{ width: `${calculateProgress()}%` }}></div>
              </div>
            </CardHeader>
            <CardContent>
              {signUpStep === 'basic' && (
                <>
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2 dark:text-gray-300">I want to join as:</div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={role === 'student' ? 'default' : 'outline'}
                        className={`flex flex-col items-center py-3 h-auto ${role === 'student'
                            ? 'bg-scholar-600 hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600 text-white'
                            : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        onClick={() => setRole('student')}
                        type="button"
                      >
                        <GraduationCap className="h-5 w-5 mb-1" />
                        <span className="text-xs">Student</span>
                      </Button>
                      <Button
                        variant={role === 'teacher' ? 'default' : 'outline'}
                        className={`flex flex-col items-center py-3 h-auto ${role === 'teacher'
                            ? 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white'
                            : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        onClick={() => setRole('teacher')}
                        type="button"
                      >
                        <FileText className="h-5 w-5 mb-1" />
                        <span className="text-xs">Teacher</span>
                      </Button>
                      <Button
                        variant={role === 'admin' ? 'default' : 'outline'}
                        className={`flex flex-col items-center py-3 h-auto ${role === 'admin'
                            ? 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white'
                            : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        onClick={() => setRole('admin')}
                        type="button"
                      >
                        <Users className="h-5 w-5 mb-1" />
                        <span className="text-xs">Admin</span>
                      </Button>
                    </div>
                  </div>

                  <Form {...signUpForm}>
                    <div className="space-y-4">
                      <FormField
                        control={signUpForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-300">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-300">Email</FormLabel>
                            <FormControl>
                              <Input placeholder="youremail@example.com" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-300">Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-300">Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        onClick={goToNextStep}
                        className={`w-full ${role === 'student'
                            ? 'bg-scholar-600 hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600'
                            : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                          }`}
                      >
                        Continue
                      </Button>
                    </div>
                  </Form>
                </>
              )}

              {signUpStep === 'role-specific' && (
                <Form {...signUpForm}>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {role === 'student' && (
                      <>
                        <div className="mb-2">
                          <h3 className="text-md font-medium dark:text-white">Academic Information</h3>
                          <Separator className="my-2" />
                        </div>
                        <FormField
                          control={signUpForm.control}
                          name="grade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Grade/Class</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <SelectValue placeholder="Select your grade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {grades.map((grade) => (
                                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="section"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Section</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <SelectValue placeholder="Select your section" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {sections.map((section) => (
                                    <SelectItem key={section} value={section}>{section}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="studentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Student ID (if available)</FormLabel>
                              <FormControl>
                                <Input placeholder="ST12345" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="rollNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Roll Number</FormLabel>
                              <FormControl>
                                <Input placeholder="42" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <div className="mb-2 mt-6">
                          <h3 className="text-md font-medium dark:text-white">Personal Information</h3>
                          <Separator className="my-2" />
                        </div>

                        <FormField
                          control={signUpForm.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Date of Birth</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Gender</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {genders.map((gender) => (
                                    <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="bloodGroup"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Blood Group</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <SelectValue placeholder="Select blood group" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {bloodGroups.map((group) => (
                                    <SelectItem key={group} value={group}>{group}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <div className="mb-2 mt-6">
                          <h3 className="text-md font-medium dark:text-white">Parent/Guardian Information</h3>
                          <Separator className="my-2" />
                        </div>

                        <FormField
                          control={signUpForm.control}
                          name="parentName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Parent/Guardian Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Parent/Guardian Full Name" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="parentEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Parent/Guardian Email</FormLabel>
                              <FormControl>
                                <Input placeholder="parent@example.com" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="parentPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Parent/Guardian Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {role === 'teacher' && (
                      <>
                        <div className="mb-2">
                          <h3 className="text-md font-medium dark:text-white">Professional Information</h3>
                          <Separator className="my-2" />
                        </div>

                        <FormField
                          control={signUpForm.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Department</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <SelectValue placeholder="Select your department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="teacherId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Teacher ID</FormLabel>
                              <FormControl>
                                <Input placeholder="T12345" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="qualification"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Highest Qualification</FormLabel>
                              <FormControl>
                                <Input placeholder="M.Sc., B.Ed., etc." {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="specialization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Specialization</FormLabel>
                              <FormControl>
                                <Input placeholder="Mathematics, Physics, etc." {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="yearsOfExperience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Years of Experience</FormLabel>
                              <FormControl>
                                <Input placeholder="5" type="number" min="0" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="dateOfJoining"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Date of Joining</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <div className="mb-2 mt-6">
                          <h3 className="text-md font-medium dark:text-white">Additional Information</h3>
                          <Separator className="my-2" />
                        </div>

                        <FormField
                          control={signUpForm.control}
                          name="teachingLicense"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Teaching License/Certification</FormLabel>
                              <FormControl>
                                <Input placeholder="License number or certification details" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="teachingPhilosophy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Teaching Philosophy</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Share your teaching approach and philosophy..." {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 min-h-[100px]" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="awards"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Awards & Recognitions</FormLabel>
                              <FormControl>
                                <Textarea placeholder="List any teaching awards or recognitions you've received..." {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {role === 'admin' && (
                      <>
                        <div className="mb-2">
                          <h3 className="text-md font-medium dark:text-white">Administrative Information</h3>
                          <Separator className="my-2" />
                        </div>

                        <FormField
                          control={signUpForm.control}
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Position</FormLabel>
                              <FormControl>
                                <Input placeholder="Principal, Vice Principal, etc." {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="adminId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Admin ID</FormLabel>
                              <FormControl>
                                <Input placeholder="A12345" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="department_admin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Department</FormLabel>
                              <FormControl>
                                <Input placeholder="Administration, Management, etc." {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="accessLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Access Level</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <SelectValue placeholder="Select access level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {accessLevels.map((level) => (
                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <div className="mb-2 mt-6">
                          <h3 className="text-md font-medium dark:text-white">Professional Background</h3>
                          <Separator className="my-2" />
                        </div>

                        <FormField
                          control={signUpForm.control}
                          name="managementExperience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Management Experience (years)</FormLabel>
                              <FormControl>
                                <Input placeholder="10" type="number" min="0" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signUpForm.control}
                          name="reportsTo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">Reports To</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., School Board, Director" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                              </FormControl>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <div className="flex justify-between gap-2 mt-4">
                      <Button
                        type="button"
                        onClick={goToPreviousStep}
                        variant="outline"
                        className="w-1/2 dark:border-gray-600 dark:text-gray-300"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={goToNextStep}
                        className={`w-1/2 ${role === 'student'
                            ? 'bg-scholar-600 hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600'
                            : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                          }`}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </Form>
              )}

              {signUpStep === 'contact' && (
                <Form {...signUpForm}>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    <div className="mb-2">
                      <h3 className="text-md font-medium dark:text-white">Contact Information</h3>
                      <Separator className="my-2" />
                    </div>

                    <FormField
                      control={signUpForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="alternatePhoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Alternate Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 987-6543" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={signUpForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-300">City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-300">State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={signUpForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-300">ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-300">Country</FormLabel>
                            <FormControl>
                              <Input placeholder="United States" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mb-2 mt-6">
                      <h3 className="text-md font-medium dark:text-white">Emergency Contact</h3>
                      <Separator className="my-2" />
                    </div>

                    <FormField
                      control={signUpForm.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Emergency Contact Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="emergencyContactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Emergency Contact Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 987-6543" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="emergencyContactRelation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Relationship to Emergency Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="Spouse, Parent, Sibling, etc." {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between gap-2 mt-4">
                      <Button
                        type="button"
                        onClick={goToPreviousStep}
                        variant="outline"
                        className="w-1/2 dark:border-gray-600 dark:text-gray-300"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={goToNextStep}
                        className={`w-1/2 ${role === 'student'
                            ? 'bg-scholar-600 hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600'
                            : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                          }`}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </Form>
              )}

              {signUpStep === 'preferences' && (
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    <div className="mb-2">
                      <h3 className="text-md font-medium dark:text-white">Preferences & Settings</h3>
                      <Separator className="my-2" />
                    </div>

                    <FormField
                      control={signUpForm.control}
                      name="languagePreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Preferred Language</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {languages.map((lang) => (
                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Bio</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tell us a bit about yourself..." {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 min-h-[100px]" />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={signUpForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-scholar-600 data-[state=checked]:border-scholar-600"
                              />
                            </FormControl>
                            <FormLabel className="dark:text-gray-300">
                              Email Notifications
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-scholar-600 data-[state=checked]:border-scholar-600"
                              />
                            </FormControl>
                            <FormLabel className="dark:text-gray-300">
                              SMS Notifications
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={signUpForm.control}
                      name="prefersDarkMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-scholar-600 data-[state=checked]:border-scholar-600"
                            />
                          </FormControl>
                          <FormLabel className="dark:text-gray-300">
                            Prefer Dark Mode
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-scholar-600 data-[state=checked]:border-scholar-600"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="dark:text-gray-300">
                              I accept the <a href="#" className="text-scholar-600 underline">terms and conditions</a> and <a href="#" className="text-scholar-600 underline">privacy policy</a>
                            </FormLabel>
                            <FormMessage className="dark:text-red-400" />
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between gap-2 mt-4">
                      <Button
                        type="button"
                        onClick={goToPreviousStep}
                        variant="outline"
                        className="w-1/2 dark:border-gray-600 dark:text-gray-300"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className={`w-1/2 ${role === 'student'
                            ? 'bg-scholar-600 hover:bg-scholar-700 dark:bg-scholar-500 dark:hover:bg-scholar-600'
                            : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                          }`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By signing up, you agree to our <a href="#" className="text-scholar-600 dark:text-scholar-400 hover:underline">Terms of Service</a>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignInSignUp;
