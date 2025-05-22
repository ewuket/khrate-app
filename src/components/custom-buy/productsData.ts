
// Sample product data
const products = [
  // Perishable Items
  {
    id: 1,
    name: "Tomatoes",
    price: 1200,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1592924357205-3f73fbe1ec67?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 2,
    name: "Onions",
    price: 800,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 3,
    name: "Cabbage",
    price: 600,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1551889779-b7e038112b7e?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 4,
    name: "Carrots",
    price: 900,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5d4f7?q=80&w=1000&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1596363505729-454a8a5349f2?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 11,
    name: "Avocados",
    price: 2000,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1551460188-2f48af84fc1f?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 12,
    name: "Milk",
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
    image: "https://images.unsplash.com/photo-1569288052329-ed0c36a817c4?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 14,
    name: "Yogurt",
    price: 900,
    unit: "container",
    image: "https://images.unsplash.com/photo-1584278858536-52532423b9ea?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 15,
    name: "Fresh Fish",
    price: 3500,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1613066823970-20ceb97c7352?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 16,
    name: "Chicken",
    price: 3000,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=1000&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1593476087123-2c1c9e7b5dc6?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 19,
    name: "Cooking Oil",
    price: 2500,
    unit: "litre",
    image: "https://images.unsplash.com/photo-1620574387735-3624d75e5972?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 20,
    name: "Salt",
    price: 400,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1582191074171-c896e0f41e8a?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 21,
    name: "Sugar",
    price: 1300,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1581441363689-1f2a6c8c0280?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 22,
    name: "Flour",
    price: 1200,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1620743364195-3e81ab8b7948?q=80&w=1000&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1591386767153-987783380885?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 25,
    name: "Canned Beans",
    price: 750,
    unit: "can",
    image: "https://images.unsplash.com/photo-1613843433065-819f0097654f?q=80&w=1000&auto=format&fit=crop",
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
    name: "Coffee",
    price: 2200,
    unit: "bag",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 28,
    name: "Cereal",
    price: 1800,
    unit: "box",
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 29,
    name: "Honey",
    price: 2500,
    unit: "jar",
    image: "https://images.unsplash.com/photo-1587049633312-d628ae40d5ea?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 30,
    name: "Peanut Butter",
    price: 1700,
    unit: "jar",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 31,
    name: "Lentils",
    price: 1300,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1515543592392-3c6b9e91cf38?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 32,
    name: "Oatmeal",
    price: 1100,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1623427480744-5bf3a10dbb17?q=80&w=1000&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1583623025817-d180a2fe075e?q=80&w=1000&auto=format&fit=crop",
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
