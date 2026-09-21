

// Menu data. In Phase 4 this will come from your backend API instead.
// type: "veg" or "nonveg"   |   price is in rupees
 
const IMG = "https://d2clawv67efefq.cloudfront.net/ccbp-responsive-website/";
 
const categories = [
  { key: "non-veg-starters", label: "Non-Veg Starters", image: IMG + "em-ginger-fried-img.png" },
  { key: "veg-starters",     label: "Veg Starters",     image: IMG + "em-veg-starters-img.png" },
  { key: "soups",            label: "Soups",            image: IMG + "em-soup-img.png" },
  { key: "seafood",          label: "Fish & Sea food",  image: IMG + "em-grilled-seafood-img.png" },
  { key: "main-course",      label: "Main Course",      image: IMG + "em-hyderabadi-biryani-img.png" },
  { key: "noodles",          label: "Noodles",          image: IMG + "em-mushroom-noodles-img.png" },
  { key: "salads",           label: "Salads",           image: IMG + "em-gluten-img.png" },
  { key: "desserts",         label: "Desserts",         image: IMG + "em-coffee-bourbon-img.png" }
];
 
const menuItems = [
  { id: 1,  name: "Ginger Fried Chicken",  category: "non-veg-starters", type: "nonveg", price: 240 },
  { id: 2,  name: "Chicken 65",            category: "non-veg-starters", type: "nonveg", price: 220 },
  { id: 3,  name: "Paneer Tikka",          category: "veg-starters",     type: "veg",    price: 200 },
  { id: 4,  name: "Crispy Corn",           category: "veg-starters",     type: "veg",    price: 160 },
  { id: 5,  name: "Tomato Soup",           category: "soups",            type: "veg",    price: 110 },
  { id: 6,  name: "Chicken Manchow Soup",  category: "soups",            type: "nonveg", price: 140 },
  { id: 7,  name: "Grilled Fish",          category: "seafood",          type: "nonveg", price: 320 },
  { id: 8,  name: "Prawn Fry",             category: "seafood",          type: "nonveg", price: 350 },
  { id: 9,  name: "Hyderabadi Biryani",    category: "main-course",      type: "nonveg", price: 280 },
  { id: 10, name: "Veg Pulao",             category: "main-course",      type: "veg",    price: 180 },
  { id: 11, name: "Mushroom Noodles",      category: "noodles",          type: "veg",    price: 170 },
  { id: 12, name: "Chicken Hakka Noodles", category: "noodles",          type: "nonveg", price: 210 },
  { id: 13, name: "Greek Salad",           category: "salads",           type: "veg",    price: 150 },
  { id: 14, name: "Fruit Salad",           category: "salads",           type: "veg",    price: 130 },
  { id: 15, name: "Coffee Bourbon Cake",   category: "desserts",         type: "veg",    price: 120 },
  { id: 16, name: "Gulab Jamun",           category: "desserts",         type: "veg",    price: 90 }
];
 
