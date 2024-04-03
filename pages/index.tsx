
import React, { useState } from "react";
import Layout from "@/components/layouts";
import { Button } from "@/components/ui/button";
import {  useToast } from "@/components/ui/use-toast";

import { useDispatch } from 'react-redux';
import { addToCart } from '@/slices/cartSlice';
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search } from "lucide-react";
export default function Home() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = React.useState<Book[] | null>(null);

  const { toast } = useToast()

  const handleAddToCart = (book : Book) => {
    dispatch(addToCart({
      bookId: book.id,
      title: book.title,
      author: book.writer,
      price: book.price,
      quantity: 1,
    }));
  };

  
  React.useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_DATABASE_URL)
    fetch(`${process.env.NEXT_PUBLIC_DATABASE_URL}/books`)
      .then(response => response.json())
      .then(data => {
        // Initialize the quantity for each item
        const initialQuantities = data.reduce((quantities: { [x: string]: number; }, item: { id: string | number; }) => {
          quantities[item.id] = 1;
          return quantities;
        }, {});


        setData(data);
      });
  }, []);

  if (data === null) return 'Loading...';

  // Filter the books data based on the selected category
  const filteredData = searchTerm
    ? data?.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase())) || []
    : selectedCategory === 'all'
      ? data
      : data?.filter(book => book.tags.includes(selectedCategory)) || [];

  return (
    <Layout>
    <div className="flex gap-4">
      
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button >Categories</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select a Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setSelectedCategory('fiction')}>fiction</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelectedCategory('non-fiction')}>non-fiction</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelectedCategory('science')}>science</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelectedCategory('essay')}>essay</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex gap-2 justify-center items-center border border-stone-950 rounded-md px-2 py-1">
          <Search />
          <input
            type="text"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            placeholder="Search by title"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-12">
        {filteredData.map(item => {
         
          return (
          <div key={item.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-gray-700 mb-2">{item.writer}</p>
            <img src={item.coverImage} alt={item.title} className="w-full h-64 object-cover mb-2" />
            <p className="text-lg font-semibold mb-2">{item.price}</p>
            <p className="text-sm text-gray-500">{item.tags}</p>
            <Button onClick={() => handleAddToCart(item)} asChild className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold ">
             <Link href="/cart/"> Add to Cart</Link>
            </Button>

          </div>
          );
        })}
      </div>
    </Layout>
  );
}
