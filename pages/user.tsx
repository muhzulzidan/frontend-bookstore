import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/layouts';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';

const OrderPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customerId, setCustomerId] = useState(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    
    useEffect(() => {
        // Get the bearer token from localStorage
        const token = localStorage.getItem('access_token');
        // Fetch the customer data from the API
        axios.get('http://localhost:3000/customers',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                // Handle the error here
                console.error('Failed to fetch customers:', error);
            });
        // Fetch the books data from the API
        axios.get('http://localhost:3000/books',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                // Handle the error here
                console.error('Failed to fetch books:', error);
            });

        // Fetch the user's available points from the backend
        axios.get('http://localhost:3000/customers/me',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then(response => {
                console.log(response.data.customerId);
                setCustomerId(response.data.customerId); 
                axios.get(`http://localhost:3000/orders/${customerId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                )
                    .then(response => {
                        console.log(response.data);
                        setOrders(response.data);
                    })
                    .catch(error => {
                        // Handle the error here
                        console.error('Failed to fetch orders:', error);
                    });
            });

     
    }, [customerId]);
    const customer = customers.find(customer => customer.id === customerId);

    const cancelOrder = (orderId: number) => {
        // Get the bearer token from localStorage
        const token = localStorage.getItem('access_token');
        
        console.log(token, "access_token");

        axios.delete(`http://localhost:3000/orders/${orderId}/cancel/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then(response => {
                alert('Order cancelled successfully');
                // Handle the response here
                console.log('Order cancelled:', response.data);
                // reload window
                window.location.reload();
            })
            .catch(error => {
                alert('Failed to cancel order');
                // Handle the error here
                console.error('Failed to cancel order:', error);
            });
    };

    return (
        <Layout >
          <section className='py-4 pb-12'>
                <h1 className="text-2xl font-bold mb-4">User Page</h1>
                {customer && (
                    <div className='py-4'>
                        <p>Customer Name: {customer.name}</p>
                        <p>Customer Points: {customer.points}</p>
                    </div>
                )}

                    {orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        <div >
                            <h2 className="text-lg font-bold mb-2">Orders:</h2>
        
                                <div className='grid grid-cols-1 md:grid-cols-3 flex-col gap-4'>
                                {orders.map((order) => {
                                    const book = books.find(book => book.id === order.bookId);

                                    return (
                                        <div key={order.id}>
                                            {/* <p>Order ID: {order.id}</p>
                                            <p>Customer ID: {order.customerId}</p>
                                            <p>Book ID: {order.bookId}</p> */}
                                            {book && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg font-bold">{book.title}</CardTitle>
                                                        <CardDescription className="text-gray-500">{book.writer}
                                                        <p>Book Price: {book.price}</p>
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <img src={book.coverImage} alt={book.title} />
                                                     
                                                    </CardContent>
                                                  <CardFooter>
                                                        <Button variant={"destructive"} onClick={() => cancelOrder(order.id)}>
                                                            Cancel Order
                                                        </Button>
                                                  </CardFooter>
                                                </Card>
                                            )}
                                        </div>
                                    );
                                })}
                          </div>
                        </div>
                    )}

          </section>
         </Layout>
    );
};

export default OrderPage;