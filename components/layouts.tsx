import { useState, ReactNode, useEffect } from "react";
import { Inter } from "next/font/google";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] });
import { logIn, logOut } from '@/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';

import { ShoppingCart, User } from "lucide-react"
import Link from "next/link";

const Layout = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch();
    const { toast } = useToast()

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const total = cartItems.reduce((total, item) => total + item.quantity, 0);

    const [login, setLogin] = useState(false)
    const [signUp, setSignUp] = useState(false)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    console.log('isLoggedIn:', isLoggedIn);

    // Effect to run once on component mount
    useEffect(() => {
        // Check local storage for access token
        const token = localStorage.getItem('access_token');

        // If there's a token, set isLoggedIn to true
        if (token) {
            dispatch(logIn());
        }
    }, []);

    const handleLogin = async () => {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (!response.ok) {
            setLogin(false)
            toast({
                variant: "destructive",
                title: "Login failed",
                description: new Date().toLocaleString(),
            })
            // throw new Error('Login failed');
        }
        toast({
            title: "Login Success",
            description: new Date().toLocaleString(),
        })
        setLogin(false)
        setSignUp(false)
        // setIsLoggedIn(true);
        // Log out the user after 5 minutes
        // setTimeout(handleLogout, 5 * 60 * 1000);
        const data = await response.json();
        dispatch(logIn());
        // Save the access token in the local storage
        localStorage.setItem('access_token', data.access_token);
    };
    const handleSignUp = async () => {
        // First, sign up the user
        const signupResponse = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (!signupResponse.ok) {
            throw new Error('signup failed');
        }

        // Then, log in the user
        const loginResponse = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (!loginResponse.ok) {
            throw new Error('login failed');
        }

        const data = await loginResponse.json();

        // Save the access token in the local storage
        localStorage.setItem('access_token', data.access_token);

        // Create a new customer
        const customerResponse = await fetch('http://localhost:3000/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.access_token}`,
            },
            body: JSON.stringify({
                name: username, // Use the username as the customer name
            }),
        });

        if (!customerResponse.ok) {
            throw new Error('Failed to create customer');
        }

        const customerData = await customerResponse.json();
        console.log('New customer created:', customerData);
        toast({
            title: "New customer created",
            description: new Date().toLocaleString(),
        })
        setLogin(false)
        dispatch(logIn());
        setSignUp(false);
    };
    const handleLogout = () => {
        // Remove the access token from local storage
        localStorage.removeItem('access_token');

        dispatch(logOut());

        toast({
            title: "Logout",
            description: new Date().toLocaleString(),
        })
    };

    return (
        <>
            <header className="flex justify-between items-center p-4">
                <Link href={"/"} className="flex justify-between items-center mb-4">
                    <h1 className="text-lg">Bookstore</h1>
                </Link>

                {/* Show login button if not logged in, otherwise show logout button */}
                {!isLoggedIn ? (
                    <div className="flex gap-4">

                        {/* Login */}
                        <Dialog open={login} onOpenChange={setLogin}>
                            <Button asChild >
                                <DialogTrigger >
                                    Login
                                </DialogTrigger>
                            </Button>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Login </DialogTitle>
                                    <DialogDescription>
                                        <div>
                                            <input
                                                className="border border-gray-300 rounded px-3 py-2 mb-2"
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                            <input
                                                className="border border-gray-300 rounded px-3 py-2 mb-2"
                                                placeholder="Password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <Button onClick={handleLogin}>
                                                Login
                                            </Button>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                        {/* handleSignUp */}
                        <Dialog open={signUp} onOpenChange={setSignUp}>
                            <Button asChild variant={"outline"} >
                                <DialogTrigger >
                                    Sign Up
                                </DialogTrigger>
                            </Button>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Sign Up </DialogTitle>
                                    <DialogDescription>
                                        <div>
                                            <input
                                                className="border border-gray-300 rounded px-3 py-2 mb-2"
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                            <input
                                                className="border border-gray-300 rounded px-3 py-2 mb-2"
                                                placeholder="Password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <Button onClick={handleSignUp}>
                                                Login
                                            </Button>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        {/* {cartItems} */}
                        <Button variant={"secondary"} asChild className="flex gap-2">
                            <Link href="/cart/">

                                <ShoppingCart />
                                {total}

                            </Link>
                        </Button>
                        <Button variant={"secondary"} asChild className="flex gap-2">
                            <Link href="/user/">
                                <User />
                                User
                            </Link>
                        </Button>

                        <Button onClick={handleLogout}>Logout</Button>

                    </div>
                )}
            </header>

            <main
                className={`flex flex-col px-4 ${inter.className}`}
            >
                {children}
            </main>
            <footer>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1em', backgroundColor: '#f5f5f5' }}>
                    <div>
                        <h3>Company Name</h3>
                        <p>123 Main St, Anytown, USA</p>
                        <p>(123) 456-7890</p>
                    </div>
                    <div>
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                            <li><a href="/help">Help</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3>Follow Us</h3>
                        <p>
                            <a href="https://www.facebook.com">Facebook</a> |
                            <a href="https://www.twitter.com">Twitter</a> |
                            <a href="https://www.instagram.com">Instagram</a>
                        </p>
                    </div>
                </div>
            </footer>
            <Toaster />
        </>
    );
};

export default Layout;
