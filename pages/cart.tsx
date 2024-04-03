import { useEffect, useState } from 'react';

import { RootState } from '../store';
import { ShoppingCartIcon } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layouts';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, updateQuantity } from '@/slices/cartSlice';
import { useRouter } from 'next/navigation';


const CartPage: React.FC = () => {
    const route = useRouter();
    const dispatch = useDispatch();

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const total = useSelector((state: RootState) => state.cart.total);

    const totalPoints = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const [userPoints, setUserPoints] = useState(0);
    const [canProceed, setCanProceed] = useState(false);
    const [customerId, setCustomerId] = useState(null);


    useEffect(() => {
        // Get the bearer token from localStorage
        const token = localStorage.getItem('access_token');


      
        // Fetch the user's available points from the backend
        axios.get(`${process.env.NEXT_PUBLIC_DATABASE_URL}/customers/me`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then(response => {
                setUserPoints(response.data.customer.points); // Use the customer.points property from the response
                setCanProceed(response.data.customer.points >= totalPoints);
                setCustomerId(response.data.customerId); // Save the customerId in your state
            });
    }, [totalPoints]);


    const handleCheckout = () => {
        if (!canProceed) {
            alert('Not enough points');
            return;
        }

        // Get the bearer token from localStorage
        const token = localStorage.getItem('access_token');


        // Assume `cartItems` is an array of objects, each with a `bookId` and `quantity`
        cartItems.forEach(item => {
            const bookId = item.bookId;
            const quantity = item.quantity;

            // Make a secure API call to the backend to place the order
            axios.post(`${process.env.NEXT_PUBLIC_DATABASE_URL}/orders`,
                {
                    customerId: customerId,
                    bookId: bookId,
                    quantity: quantity
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
                .then(response => {
                    alert('Order placed successfully');
                    dispatch(clearCart()); // Clear the cart
                })
                .catch(error => {
                    alert('Failed to place order');
                });
        });
    };

    return (
        <Layout>
            <section className='py-4 pb-12'>
                <h1 className="text-2xl font-bold mb-4">Carts</h1>
                <section className='flex gap-4 '>
                    <div className="grid gap-4 w-full">
                        {cartItems.map((item, index) => (
                            <Card key={index} className="p-4 border border-gray-300 rounded">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                                    <CardDescription className="text-gray-500">{item.author}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-2">Price: {item.price}</p>
                                    {/* <p className="mb-2">Quantity: {item.quantity}</p> */}
                                   <div className='flex justify-start'>
                                        <form className="max-w-xs">
                                          
                                            <div className="relative flex items-center max-w-[8rem]">
                                                <button type='button' id="decrement-button" onClick={() => dispatch(updateQuantity({ bookId: item.bookId, quantity: Math.max(1, item.quantity - 1) }))} className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                                                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                                                    </svg>
                                                </button>
    
                                                <input type="text" id="quantity-input" value={item.quantity} 
                                                readOnly className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="999" required />
    
                                                <button type='button' id="increment-button" onClick={() => dispatch(updateQuantity({ bookId: item.bookId, quantity: item.quantity + 1 }))} className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                                                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                          
                                        </form>
                                   </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                   <div className='w-6/12'>
                        <h4 className='text-xl font-bold'>Total : {total}</h4>
                        <Button onClick={handleCheckout} className="mt-4">
                            <ShoppingCartIcon size={24} className="mr-2" />
                            Checkout
                        </Button>
                   </div>
                </section>
            </section>
        </Layout>
    );
};

export default CartPage;