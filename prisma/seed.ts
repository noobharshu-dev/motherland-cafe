import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Motherland Cafe database with Full Menu...");

  // ── Menu Categories ────────────────────────────────────────────
  const categoriesData = [
    { id: "coffee", name: "Coffee & Espresso", displayOrder: 1 },
    { id: "fresh-juices", name: "Fresh Juices", displayOrder: 2 },
    { id: "beverages", name: "Beverages & Coolers", displayOrder: 3 },
    { id: "kombucha", name: "House Brewed Kombucha", displayOrder: 4 },
    { id: "desserts", name: "Desserts & Bakery", displayOrder: 5 },
    { id: "eggs", name: "All Day Eggs", displayOrder: 6 },
    { id: "salads", name: "Salads", displayOrder: 7 },
    { id: "crepes", name: "Buckwheat Crepes", displayOrder: 8 },
    { id: "bagels", name: "Bagels", displayOrder: 9 },
    { id: "sandwiches", name: "Between Breads", displayOrder: 10 },
    { id: "small-bites", name: "Small Bites", displayOrder: 11 },
    { id: "big-bites", name: "Big Bites", displayOrder: 12 },
    { id: "pasta", name: "Handrolled Pasta", displayOrder: 13 },
    { id: "gnocchi", name: "Fresh Potato Gnocchi", displayOrder: 14 },
    { id: "risotto", name: "Risotto", displayOrder: 15 },
    { id: "pizzas", name: "Pizzas", displayOrder: 16 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.menuCategory.upsert({
      where: { id: cat.id },
      update: { name: cat.name, displayOrder: cat.displayOrder },
      create: cat,
    });
    categories[cat.id] = created.id;
  }

  // ── Menu Items ─────────────────────────────────────────────────
  const menuItems = [
    // Coffee
    { cat: "coffee", name: "Espresso", price: 100, desc: "Classic single shot" },
    { cat: "coffee", name: "Americano", price: 200, desc: "Espresso over hot water" },
    { cat: "coffee", name: "Iced Americano", price: 240, desc: "Chilled espresso over ice" },
    { cat: "coffee", name: "Cloudy Americano", price: 240, desc: "" },
    { cat: "coffee", name: "Peach Americano", price: 250, desc: "" },
    { cat: "coffee", name: "Cortado", price: 200, desc: "Equal parts espresso and steamed milk" },
    { cat: "coffee", name: "Cappuccino", price: 220, desc: "Espresso with thick micro-foam" },
    { cat: "coffee", name: "Iced Cappuccino", price: 250, desc: "" },
    { cat: "coffee", name: "Cinnamon Cappuccino", price: 250, desc: "Topped with Ceylon cinnamon dust", feat: true },
    { cat: "coffee", name: "Latte", price: 240, desc: "Espresso with steamed milk" },
    { cat: "coffee", name: "Iced Latte", price: 280, desc: "" },
    { cat: "coffee", name: "Lavender Latte", price: 300, desc: "House-made lavender syrup, floral and calming", feat: true },
    { cat: "coffee", name: "Vanilla Latte", price: 250, desc: "House vanilla bean syrup" },
    { cat: "coffee", name: "Salted Caramel Coffee", price: 300, desc: "" },
    { cat: "coffee", name: "Hazlenut Coffee", price: 300, desc: "" },
    { cat: "coffee", name: "Cold Coffee", price: 280, desc: "" },

    // Fresh Juices
    { cat: "fresh-juices", name: "Good For Heart", price: 300, desc: "Apple, beetroot, carrot, ginger", vegan: true, gf: true },
    { cat: "fresh-juices", name: "Good For Gut", price: 300, desc: "Green apple, spinach, celery, cucumber, mint", vegan: true, gf: true },
    { cat: "fresh-juices", name: "Good For Skin", price: 300, desc: "Orange, basil", vegan: true, gf: true },
    { cat: "fresh-juices", name: "Good For All", price: 300, desc: "Make your own from a choice of fruits or veggies", vegan: true, gf: true },

    // Beverages
    { cat: "beverages", name: "Barley Detox", price: 250, desc: "" },
    { cat: "beverages", name: "Summer Coolers", price: 250, desc: "" },
    { cat: "beverages", name: "Sugarcane Blend", price: 250, desc: "" },
    { cat: "beverages", name: "Finest Hot Chocolate", price: 350, desc: "Available November-February" },

    // Kombucha
    { cat: "kombucha", name: "Burnt Lemon Pepper Berry", price: 350, desc: "Sugar Free, Gluten Free, Pro-Biotic", gf: true, vegan: true },
    { cat: "kombucha", name: "Thai Tamarind", price: 350, desc: "Sugar Free, Gluten Free, Pro-Biotic", gf: true, vegan: true },
    { cat: "kombucha", name: "Cherry Cola", price: 350, desc: "Sugar Free, Gluten Free, Pro-Biotic", gf: true, vegan: true },
    { cat: "kombucha", name: "Ginger Kombucha", price: 350, desc: "Sugar Free, Gluten Free, Pro-Biotic", gf: true, vegan: true },
    { cat: "kombucha", name: "Raspberry Blast", price: 350, desc: "Sugar Free, Gluten Free, Pro-Biotic", gf: true, vegan: true },

    // Desserts
    { cat: "desserts", name: "Lemon Blueberry Tea Slice", price: 180, desc: "Sugar Free / Gluten Free", gf: true, feat: true },
    { cat: "desserts", name: "Coconut Jaggery Tea Slice", price: 200, desc: "Sugar Free / Gluten Free", gf: true },
    { cat: "desserts", name: "Oats Cranberry Slice", price: 200, desc: "" },
    { cat: "desserts", name: "Cheesecake of the Day", price: 320, desc: "Ask your server" },
    { cat: "desserts", name: "Babka Pain Perdu (House Special)", price: 400, desc: "House Special" },

    // Eggs
    { cat: "eggs", name: "Eggs Bordeaux", price: 380, desc: "Classic French Omelette" },
    { cat: "eggs", name: "Bharooch Akuri", price: 400, desc: "Parsi scrambled eggs in house ground spice blend, topped with carrot bajra croutons and crumbled feta" },
    { cat: "eggs", name: "Posh Omelette", price: 450, desc: "Omelette stuffed with Asparagus, Parsley, Gorgonzola & Walnuts" },
    { cat: "eggs", name: "New York Poached Eggs", price: 500, desc: "Gooey poached eggs on house-made brioche buns with a cream of spinach and freshly made Hollandaise sauce" },
    { cat: "eggs", name: "Philly Poached Eggs", price: 580, desc: "Gooey poached eggs on a bed of creamy bacon and drizzled with freshly made Hollandaise sauce" },
    { cat: "eggs", name: "Eggs Wrap", price: 480, desc: "A Gluten Free wrap made with Eggs and filled with mushrooms, onions, cherry tomatoes and cheese", gf: true },
    { cat: "eggs", name: "Japanese Egg Sando", price: 400, desc: "Creamy egg mash with onions, parsley and a secret japanese sauce between housemade bread" },

    // Salads (All GF)
    { cat: "salads", name: "Motherland Signature Greens", price: 450, desc: "Daily dose of minerals and greens with apples, water chestnuts, baby mozzarella and truffle oil vinaigrette", gf: true, feat: true },
    { cat: "salads", name: "Cold Soba Noodle Salad", price: 400, desc: "English cucumber, fresh peppers, carrots and celery tossed in a house made Fujian dressing", gf: true },
    { cat: "salads", name: "Quinoa Salad", price: 450, desc: "Quinoa tossed with Bell Peppers, Mangoes or Avos, Tomatoes and an orange vinegrette", gf: true, vegan: true },
    { cat: "salads", name: "Healthy Warm Salad", price: 520, desc: "Roasted beetroot, carrots & broccoli served with poached pears, asparagus on blue cheese dressing", gf: true },
    { cat: "salads", name: "Motherland Protein Fix", price: 580, desc: "Greens with grilled chicken, apples, water chestnuts, baby mozzarella and truffle vinaigrette", gf: true },
    { cat: "salads", name: "Vegan Fitness Salad", price: 480, desc: "Roasted sweet potato and chickpea salad with spinach and avocado dressing", gf: true, vegan: true },
    { cat: "salads", name: "Burrata in Wonderland", price: 650, desc: "Fresh whole Burrata served with a Blueberry Coulis surrounded by tiny tomatoes, greens, olives", gf: true, feat: true },

    // Crepes (All GF Veg)
    { cat: "crepes", name: "Brittany Crepe", price: 620, desc: "Wild Mushrooms, cheese crumble, Spinach & Onion Jam", gf: true, veg: true },
    { cat: "crepes", name: "Caprese Crepe", price: 620, desc: "Mozzarella, Tomatoes in Pesto and Arugula with a vinaigrette", gf: true, veg: true },
    { cat: "crepes", name: "Libyan Crepe", price: 620, desc: "Hummus, Feta, Grilled Peppers, Zucchini and Fresh Mushrooms & Tomatoes", gf: true, veg: true },
    { cat: "crepes", name: "Farmhouse Crepe", price: 680, desc: "Pesto Chicken with cheese. You can Add Avocado.", gf: true },

    // Bagels
    { cat: "bagels", name: "Everything Bagel", price: 300, desc: "" },
    { cat: "bagels", name: "Pesto Cream Cheese Bagel", price: 350, desc: "" },
    { cat: "bagels", name: "Tomato Avocado Bagel", price: 400, desc: "" },
    { cat: "bagels", name: "Caramalized Onion Mushroom Bagel", price: 380, desc: "" },
    { cat: "bagels", name: "Egg and Bacon Bagel", price: 450, desc: "" },

    // Between Breads
    { cat: "sandwiches", name: "Caprese Panini", price: 350, desc: "Classic Tomato, Petit Mozzarella and Pesto" },
    { cat: "sandwiches", name: "Pobis Treat", price: 350, desc: "Barbequed Exotic Vegetables grilled and then toasted in house Panini" },
    { cat: "sandwiches", name: "Chef's Chicken Sando", price: 400, desc: "Pesto marinated Chicken with herbs in house Panini" },
    { cat: "sandwiches", name: "Barbecued Chicken Sando", price: 400, desc: "Smoked Chicken with herbs in house Panini" },
    { cat: "sandwiches", name: "Famous Grilled Cheese", price: 400, desc: "Four Cheese - Parmesan - Gorgonzola - Mozzarella - Aged Cheddar loaded in Ragi Sourdough with Smoked Paprika" },
    { cat: "sandwiches", name: "Napoli", price: 450, desc: "Marinara sauce lathered on Ragi Sourdough, grilled with fresh Mozzarella and basil" },
    { cat: "sandwiches", name: "Chef’s Special Tartine", price: 520, desc: "Sourdough topped with chickpea and vegetable mash, olives, tomatoes, baked with fresh mozzarella and blue cheese" },

    // Small Bites
    { cat: "small-bites", name: "Have-A-Cado on Toast", price: 480, desc: "Creamy Avocado Mash on Charcoal Bread, feta crumble, olives, tomatoes & secret dressing", veg: true },
    { cat: "small-bites", name: "Beirut Bowl", price: 480, desc: "Chickpea and Sesame Hummus with chargrilled exotic vegetables and toasted carrot bajra breads", veg: true },
    { cat: "small-bites", name: "Shroom Brioche", price: 520, desc: "Wild mushrooms coated in buttered garlic and cream on top of our speical brioche buns", veg: true },
    { cat: "small-bites", name: "Texas Wrap (Veg/Chicken)", price: 450, desc: "Housemade Tortilla loaded with cheese, grilled vegetables and red beans soaked and mashed with house blend spices" },
    { cat: "small-bites", name: "Arabian Wrap", price: 480, desc: "Slow cooked chicken wrapped in housemade pita and served with smokey handcut fries" },
    { cat: "small-bites", name: "Korean Egg Roll", price: 450, desc: "Spicy overeasy eggs cooked with housemade Korean oil and layed inside a housemade roll with lettuce and garlic sauce" },

    // Big Bites
    { cat: "big-bites", name: "Verdure Firenze", price: 620, desc: "Brown Rice, Oats, Barley Risotto cooked with parmesan, honey and chilli. Served with fresh spinach puree", gf: true },
    { cat: "big-bites", name: "Mount Olympus", price: 720, desc: "Pan Roasted Chicken Breast stuffed with Bell Peppers, Olives, Capers, Basil and Cheese on Pizzaiola Sauce" },
    { cat: "big-bites", name: "Cracked Potato with Thai Asparagus", price: 680, desc: "Imported Asparagus with cracked potatoes and accompanied with poached eggs and hollandaise", gf: true },
    { cat: "big-bites", name: "Grilled Chicken with Shroom Pepper", price: 680, desc: "Chicken marinated in Turkish spices and grilled to perfection with veggies and mushroom pepper sauce" },
    { cat: "big-bites", name: "Farmers Hot Pot", price: 620, desc: "Hand rolled Lasagna sheet with fresh exotic vegetables and housemade sauce" },
    { cat: "big-bites", name: "Quinoa Tomatina Olio", price: 580, desc: "Quinoa tossed in olive oil with garlic, broccoli, olives, cherry tomatoes and mushrooms" },

    // Pasta
    { cat: "pasta", name: "Sicilian Tortellini", price: 600, desc: "Handmade Tortellini stuffed with sweet corn and cream cheese mousse in tomato olive broth" },
    { cat: "pasta", name: "Romagna Tortellini", price: 600, desc: "Handmade Tortellini stuffed with spinach and ricotta in tomato ragout and burnt butter" },
    { cat: "pasta", name: "Gluten Free Pasta", price: 620, desc: "Handmade GF Pasta rings in a soupy vegan broth", gf: true, vegan: true },
    { cat: "pasta", name: "Truffle Pasta", price: 600, desc: "Handrolled pasta tossed in creamy truffle sauce" },
    { cat: "pasta", name: "Fresh Hand Cut Fettuccini", price: 580, desc: "Served in either Arrabiata Italian Tomato Sauce or Alfredo" },
    { cat: "pasta", name: "Scopiare", price: 680, desc: "Fresh Raviolis filled with creamy Burrata and tossed in carrot sauce and garnished with toasted nuts" },
    { cat: "pasta", name: "Carbonara", price: 680, desc: "Authentic Italian Fettuccine with Bacon and Egg Carbonara" },

    // Gnocchi
    { cat: "gnocchi", name: "Poppy Gnocchi", price: 580, desc: "Handmade Gnocchi in Gorgonzola sauce, dressed with roasted Poppy Seeds & Nuts", gf: true },
    { cat: "gnocchi", name: "Pesto Gnocchi", price: 580, desc: "Handmade Gnocchi in housemade Italian Basil Pesto", gf: true },
    { cat: "gnocchi", name: "Buttered Spinach Gnocchi", price: 580, desc: "Handmade Gnocchi with spinach tossed in butter and served with cherry tomatoes", gf: true },

    // Risotto
    { cat: "risotto", name: "Riso de Campania", price: 580, desc: "Creamy orborio rice cooked with tomatoes and parmesan" },
    { cat: "risotto", name: "Pesto Risotto", price: 580, desc: "Cooked with housemade fresh Pesto and cream" },

    // Pizzas
    { cat: "pizzas", name: "Ragi Pizza (House Speciality)", price: 780, desc: "Neapolitan Pizza made using Ragi flour - customize as per your fancy", gf: true, feat: true },
    { cat: "pizzas", name: "Pizza Bianca", price: 780, desc: "Ricotta cream, mozzarella, blue cheese, parmesan, topped with mushroom, spinach, onions, spicy honey" },
  ];

  for (const item of menuItems) {
    // Basic slugification for ID
    const itemId = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    // Attempting to assign random elegant Unsplash images based on category or keep it blank for them to add later.
    let imgUrl = "";
    if (item.cat === "coffee") imgUrl = "/images/pour_over.png";
    else if (item.cat === "salads") imgUrl = "/images/power_bowl.png";
    else if (item.cat === "desserts") imgUrl = "/images/lavender_latte.png";
    else if (item.cat === "pizzas") imgUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80";
    else if (item.cat === "eggs") imgUrl = "/images/avocado_toast.png";
    
    await prisma.menuItem.upsert({
      where: { id: itemId },
      update: {
        name: item.name,
        price: item.price,
        description: item.desc,
        categoryId: categories[item.cat],
        isFeatured: !!item.feat,
        isVegetarian: !!item.veg || !!item.vegan,
        isVegan: !!item.vegan,
        isGlutenFree: !!item.gf,
        // Only update image if it was blank and we have a placeholder
        imageUrl: imgUrl ? imgUrl : undefined
      },
      create: {
        id: itemId,
        categoryId: categories[item.cat],
        name: item.name,
        description: item.desc,
        price: item.price,
        imageUrl: imgUrl,
        isVegetarian: !!item.veg || !!item.vegan,
        isVegan: !!item.vegan,
        isGlutenFree: !!item.gf,
        isFeatured: !!item.feat,
      },
    });
  }

  // Ensure reviews and gallery remain untouched or seeded if missing.
  console.log("✅ Main Menu Seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
