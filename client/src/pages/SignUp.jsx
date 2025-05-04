import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { GraduationCap, FileText } from "lucide-react";
import { signUpUser } from "@/features/auth/authApi";

const subjectOptions = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "English", label: "English" },
  { value: "History", label: "History" },
  { value: "Geography", label: "Geography" },
  { value: "Computer Science", label: "Computer Science" },
];

export default function SignUp() {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues:
      role === "student"
        ? {
          username: "",
          email: "",
          password: "",
          class: "",
          age: "",
          school: "",
          favSubjects: [],
          weakSubjects: [],
        }
        : {
          username: "",
          email: "",
          password: "",
          classes: "",
          age: "",
          school: "",
          subjects: [],
          experience: "",
        },
  });

  useEffect(() => {
    form.reset({
      username: "",
      email: "",
      password: "",
      class: "",
      classes: "",
      age: "",
      school: "",
      favSubjects: [],
      weakSubjects: [],
      subjects: [],
      experience: "",
    });
  }, [role, form]);

  const handleSubmit = async (data) => {
    console.log("handleSignUp called with data:", data, role);
    try {
      const userData = {
        username: data.username,
        email: data.email,
        password: data.password,
        role,
        age: data.age,
        school: data.school,
        ...(role === "student" && {
          class: data.class,
          favSubjects: data.favSubjects.map((s) => s.value),
          weakSubjects: data.weakSubjects.map((s) => s.value),
        }),
        ...(role === "teacher" && {
          classes: data.classes.split(",").map((c) => c.trim()),
          subjects: data.subjects.map((s) => s.value),
          experience: data.experience,
        }),
      };
      const response = await dispatch(signUpUser(userData));
      localStorage.setItem("user", JSON.stringify(response.user));
      toast.success("Sign up successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("handleSignUp Error:", error.message, error);
      toast.error(error.message || "Sign up failed");
    }
  };

  return (
    <>
      <div className="w-[500px] mx-auto">
        <div className="text-center mb-8 mt-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 animate-pulse">
            VidyaVerse
          </h1>
          <p className="text-2xl text-gray-700 font-medium">
            Unlock Your Learning Journey!
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Learn
            </span>
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              Grow
            </span>
            <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              Succeed
            </span>
          </div>
        </div>
        <Card className="border-gray-200 bg-white max-w-lg mx-auto mt-20">
          <CardHeader>
            <CardTitle className="text-gray-900">Sign Up</CardTitle>
            <CardDescription className="text-gray-600">
              Create your account and join as a {role}.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <div className="text-sm font-medium mb-2 text-gray-600">I am a:</div>
              <div className="grid grid-cols-2 gap-2">
                {["student", "teacher"].map((r) => (
                  <Button
                    key={r}
                    variant={role === r ? "default" : "outline"}
                    className={`flex flex-col items-center py-3 h-auto ${role === r
                      ? "bg-gray-800 cursor-pointer hover:bg-gray-600 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    onClick={() => setRole(r)}
                    type="button"
                  >
                    {r === "student" && <GraduationCap className="h-5 w-5 mb-1" />}
                    {r === "teacher" && <FileText className="h-5 w-5 mb-1" />}
                    <span className="text-xs capitalize">{r}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-600">Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="yourusername"
                            {...field}
                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-600">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="youremail@example.com"
                            {...field}
                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-600">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Student Fields */}
                  {role === "student" && (
                    <>
                      <FormField
                        control={form.control}
                        name="class"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">Class</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                placeholder="10, 12 etc."
                                className="bg-white border-gray-300 text-gray-900"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="favSubjects"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">
                              Favorite Subjects
                            </FormLabel>
                            <FormControl>
                              <Select
                                isMulti
                                options={subjectOptions}
                                value={field.value}
                                onChange={(selected) => field.onChange(selected)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weakSubjects"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">
                              Weak Subjects
                            </FormLabel>
                            <FormControl>
                              <Select
                                isMulti
                                options={subjectOptions}
                                value={field.value}
                                onChange={(selected) => field.onChange(selected)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Teacher Fields */}
                  {role === "teacher" && (
                    <>
                      <FormField
                        control={form.control}
                        name="classes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">
                              Classes You Teach (comma-separated)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="10, 11, 12"
                                className="bg-white border-gray-300 text-gray-900"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subjects"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">
                              Subjects You Teach
                            </FormLabel>
                            <FormControl>
                              <Select
                                isMulti
                                options={subjectOptions}
                                value={field.value}
                                onChange={(selected) => field.onChange(selected)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">
                              Experience (Years)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="3"
                                className="bg-white border-gray-300 text-gray-900"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Common Fields */}
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-600">Age</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="18"
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-600">
                          School / Institute
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ABC Public School"
                            className="bg-white border-gray-300 text-girl-900"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-gray-800 hover:bg-gray-600 text-white"
                >
                  Sign Up
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}