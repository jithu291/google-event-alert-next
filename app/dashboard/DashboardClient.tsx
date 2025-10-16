"use client";

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, LogOut, Phone, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from "sonner"

const phoneSchema = z.object({
    phoneNumber: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be at most 15 digits')
        .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number format'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

export default function DashboardClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState({
        name: '',
        email: '',
        image: '',
        phoneNumber: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            phoneNumber: '',
        },
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated' && session) {
            fetchUserProfile();
        }
    }, [status, session]);

    const fetchUserProfile = async () => {
        try {
            const response = await api.getProfile();
            const profileData = response.data || response;

            const userData = {
                name: profileData.name || session?.user?.name || 'User',
                email: profileData.email || session?.user?.email || '',
                image: profileData.image || session?.user?.image || '',
                phoneNumber: profileData.phoneNumber || '',
            };

            setUser(userData);
            form.reset({
                phoneNumber: profileData.phoneNumber || '',
            });

        } catch (err) {
            const fallbackData = {
                name: session?.user?.name || 'User',
                email: session?.user?.email || '',
                image: session?.user?.image || '',
                phoneNumber: '',
            };
            setUser(fallbackData);
            form.reset({ phoneNumber: '' });
        }
    };

    const getFirstName = () => {
        if (!user.name) return 'User';
        return user.name.split(' ')[0];
    };

    if (status === 'loading' || status === 'unauthenticated') {
        return null;
    }

    const onSubmit = async (data: PhoneFormData) => {
        setIsLoading(true);
        try {
            await api.updatePhone(data.phoneNumber);
            setUser(prev => ({ ...prev, phoneNumber: data.phoneNumber }));
            toast("Phone number updated successfully!");
        } catch (error) {
            toast("Phone number updating failed!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.deletePhone();
            fetchUserProfile();
        } catch (error) {
            toast("Phone number updating failed!");
        } 
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-black border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-white">
                                Dashboard
                            </h1>
                        </div>

                        <div className="hidden md:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.image || ''} alt={user.name} />
                                            <AvatarFallback className="bg-muted text-black">
                                                <User className="h-5 w-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-80" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="px-2 py-1.5">
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground">Phone Number</p>
                                                <p className="text-sm font-medium truncate">
                                                    {user.phoneNumber || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-white">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="bg-black text-white">
                                    <SheetHeader>
                                        <SheetTitle>Profile</SheetTitle>
                                        <SheetDescription className="text-muted-foreground">
                                            Manage your account settings
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={user.image || ''} alt={user.name} />
                                                <AvatarFallback className="bg-muted text-black">
                                                    <User className="h-6 w-6" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground">Phone Number</p>
                                                <p className="text-sm text-white truncate">
                                                    {user.phoneNumber || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleSignOut}
                                            variant="destructive"
                                            className="w-full"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sign Out
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Welcome back, {getFirstName()}! 👋
                            </CardTitle>
                            <CardDescription>
                                Update your phone number to receive important notifications
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle>Phone Number</CardTitle>
                                    <CardDescription>Keep your contact information up to date</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="+1 (555) 123-4567"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Enter your phone number with country code
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex space-x-3">
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-black text-white hover:bg-gray-800"
                                        >
                                            {isLoading ? 'Updating...' : 'Update Phone Number'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleDelete()}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}