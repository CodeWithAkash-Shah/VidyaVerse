import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { GraduationCap, FileText } from 'lucide-react'
import { signInUser } from '@/features/auth/authApi'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'

const SignIn = () => {
    const [role, setRole] = useState('student')
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const signInForm = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const { handleSubmit, formState } = signInForm
    const { isSubmitting } = formState

    const handleSignIn = async (data) => {
        try {
            await dispatch(signInUser({
                email: data.email,
                password: data.password,
                role,
            }))
            toast.success('Sign in successful!');
            navigate('/dashboard');
        } catch (error) {
            console.error('handleSignIn Error:', error.message, error);
            toast.error(error.message || 'Invalid credentials');
        }
    };


    return (
        <div className="w-full max-w-md mx-auto">
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
            <Card className="border-gray-200 bg-white max-w-md mx-auto mt-20">
                <CardHeader>
                    <CardTitle className="text-gray-900">Sign In</CardTitle>
                    <CardDescription className="text-gray-600">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="text-sm font-medium mb-2 text-gray-600">I am a:</div>
                        <div className="grid grid-cols-2 gap-2">
                            {['student', 'teacher'].map((r) => (
                                <Button
                                    key={r}
                                    variant={role === r ? 'default' : 'outline'}
                                    className={`flex flex-col items-center py-3 h-auto cursor-pointer ${role === r
                                        ? 'bg-gray-800 hover:bg-gray-700 text-white'
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setRole(r)}
                                    type="button"
                                >
                                    {r === 'student' && <GraduationCap className="h-5 w-5 mb-1" />}
                                    {r === 'teacher' && <FileText className="h-5 w-5 mb-1" />}
                                    <span className="text-xs capitalize">{r}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Form {...signInForm}>
                        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
                            <FormField
                                control={signInForm.control}
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
                            <FormField
                                control={signInForm.control}
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
                            <Button
                                type="submit"
                                className="w-full bg-gray-800 hover:bg-gray-600 text-white cursor-pointer"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an Account?{' '}
                        <Link to="/signup" className="text-blue-500 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignIn