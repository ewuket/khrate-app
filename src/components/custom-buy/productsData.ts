
// Sample product data
const products = [
  // Perishable Items
  {
    id: 1,
    name: "Tomatoes",
    price: 1200,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 2,
    name: "Onions",
    price: 800,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 3,
    name: "Cabbage",
    price: 600,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1551887196-72e32bfc7bf3?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 4,
    name: "Carrots",
    price: 900,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 5,
    name: "Potatoes",
    price: 700,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 6,
    name: "Spinach",
    price: 500,
    unit: "bundle",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 7,
    name: "Bell Peppers",
    price: 1500,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 8,
    name: "Bananas",
    price: 1000,
    unit: "bunch",
    image: "https://images.unsplash.com/photo-1543218024-57a70143c369?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 9,
    name: "Apples",
    price: 1800,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 10,
    name: "Grapes",
    price: 2200,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 11,
    name: "Avocados",
    price: 2000,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 12,
    name: "Inyange Milk",
    price: 1100,
    unit: "liter",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 13,
    name: "Eggs",
    price: 1800,
    unit: "dozen",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 14,
    name: "Inyange Yogurt",
    price: 900,
    unit: "container",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 15,
    name: "Fresh Fish",
    price: 3500,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 16,
    name: "Chicken",
    price: 3000,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  
  // Non-Perishable Items
  {
    id: 17,
    name: "Rice",
    price: 1600,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 18,
    name: "Beans",
    price: 1400,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 19,
    name: "Cooking Oil",
    price: 2500,
    unit: "litre",
    image: "https://images.unsplash.com/photo-1631895488345-4bf5a5819783?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 20,
    name: "Salt",
    price: 400,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1535301532365-e99399e361fb?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 21,
    name: "Sugar",
    price: 1300,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c274226?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 22,
    name: "Cassava Flour",
    price: 1200,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1603046812682-8099916309a3?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 23,
    name: "Pasta",
    price: 1000,
    unit: "packet",
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 24,
    name: "Canned Tomatoes",
    price: 900,
    unit: "can",
    image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 25,
    name: "Canned Beans",
    price: 750,
    unit: "can",
    image: "https://images.unsplash.com/photo-1596097025038-6d04e151b288?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 26,
    name: "Tea Bags",
    price: 1100,
    unit: "box",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 27,
    name: "Gorela Coffee",
    price: 2200,
    unit: "bag",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 28,
    name: "Cereal",
    price: 1800,
    unit: "box",
    image: "https://images.unsplash.com/photo-1626257726556-42048da20a1a?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 29,
    name: "Honey",
    price: 2500,
    unit: "jar",
    image: "https://images.unsplash.com/photo-1598060585654-ce91bec18c9e?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 30,
    name: "Peanut Butter",
    price: 1700,
    unit: "jar",
    image: "https://images.unsplash.com/photo-1590305173453-2df69b218222?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 31,
    name: "Lentils",
    price: 1300,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1622390574121-271406437ec8?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 32,
    name: "Oatmeal",
    price: 1100,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  
  // Household Items
  {
    id: 33,
    name: "Soap",
    price: 650,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?q=80&w=1000&auto=format&fit=crop",
    category: "household"
  },
  {
    id: 34,
    name: "Toilet Paper",
    price: 1200,
    unit: "pack",
    image: "https://images.unsplash.com/photo-1583251633264-283c859805b7?q=80&w=1000&auto=format&fit=crop",
    category: "household"
  },
  {
    id: 35,
    name: "Cleaning Spray",
    price: 1500,
    unit: "bottle",
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?q=80&w=1000&auto=format&fit=crop",
    category: "household"
  }
];

export default products;
