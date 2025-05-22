
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
    image: "https://images.unsplash.com/photo-1584896630868-2983e008918f?q=80&w=1000&auto=format&fit=crop",
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
    image: "https://inyange.rw/wp-content/uploads/2020/09/Inyange-Long-Life-Milk.png",
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
    image: "https://inyange.rw/wp-content/uploads/2020/09/Inyange-Flavored-Drinking-Yoghurt.png",
    category: "perishable"
  },
  {
    id: 15,
    name: "Fresh Fish",
    price: 3500,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1505692952048-9d0af-7ffb9?q=80&w=1000&auto=format&fit=crop",
    category: "perishable"
  },
  {
    id: 16,
    name: "Chicken",
    price: 3000,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1620574387735-3624d75e5972?q=80&w=1000&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1551489810-9d0a7d51f2a7?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 19,
    name: "Cooking Oil",
    price: 2500,
    unit: "litre",
    image: "https://images.unsplash.com/photo-1632783169610-b1309b670e77?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 20,
    name: "Salt",
    price: 400,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442a?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 21,
    name: "Sugar",
    price: 1300,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 22,
    name: "Cassava Flour",
    price: 1200,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1627656686267-9fbe04756ff0?q=80&w=1000&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1594312180721-3b5217cfc65f?q=80&w=1000&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1000&auto=format&fit=crop",
    category: "non-perishable"
  },
  {
    id: 28,
    name: "Cereal",
    price: 1800,
    unit: "box",
    image: "https://images.unsplash.com/photo-1521483451569-e33803c593dd?q=80&w=1000&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1611575619751-dae331bcd6fc?q=80&w=1000&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1626371353494-ed9ed481293c?q=80&w=1000&auto=format&fit=crop",
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
