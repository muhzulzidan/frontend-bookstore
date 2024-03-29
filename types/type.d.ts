interface Book {
    id: number;
    title: string;
    writer: string;
    coverImage: string;
    price: number;
    tags: string[];
    orders: Order[];
}

interface User {
    id: number;
    username: string;
    password: string;
}

interface Order {
    id: number;
    customerId: number;
    customer: Customer;
    bookId: number;
    book: Book;
    quantity: number;
}

interface Customer {
    id: number;
    name: string;
    points: number;
    orders: Order[];
}