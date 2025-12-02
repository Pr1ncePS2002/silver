import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating categories...');

  // Define new categories
  const newCategories = [
    {
      name: 'Mens ring',
      description: 'Elegant rings designed for men',
      imageUrl: '/images/categories/mens-rings.jpg'
    },
    {
      name: 'Ladies ring',
      description: 'Beautiful rings designed for women',
      imageUrl: '/images/categories/ladies-rings.jpg'
    },
    {
      name: 'Mens earrings',
      description: 'Stylish earrings for men',
      imageUrl: '/images/categories/mens-earrings.jpg'
    },
    {
      name: 'Mens watches',
      description: 'Luxury timepieces designed for men',
      imageUrl: '/images/categories/mens-watches.jpg'
    },
    {
      name: 'Ladies watches',
      description: 'Elegant timepieces designed for women',
      imageUrl: '/images/categories/ladies-watches.jpg'
    },
    {
      name: 'Silver frames',
      description: 'Beautiful silver frames for eyeglasses',
      imageUrl: '/images/categories/silver-frames.jpg'
    },
    {
      name: 'Pendants',
      description: 'Precious and elegant pendant pieces',
      imageUrl: '/images/categories/pendants.jpg'
    },
    {
      name: 'Ladies earrings',
      description: 'Stunning earrings to complete your look',
      imageUrl: '/images/categories/ladies-earrings.jpg'
    },
    {
      name: 'Ladies bracelet',
      description: 'Beautiful bracelets and bangles for women',
      imageUrl: '/images/categories/ladies-bracelets.jpg'
    },
    {
      name: 'Gents bracelet',
      description: 'Stylish bracelets designed for men',
      imageUrl: '/images/categories/gents-bracelets.jpg'
    },
    {
      name: 'Pendant sets',
      description: 'Complete pendant sets with matching accessories',
      imageUrl: '/images/categories/pendant-sets.jpg'
    },
    {
      name: 'Anklets',
      description: 'Elegant anklets to adorn your feet',
      imageUrl: '/images/categories/anklets.jpg'
    },
  ];

  // Get all existing categories
  const existingCategories = await prisma.category.findMany();
  console.log(`Found ${existingCategories.length} existing categories`);

  // Create or update each category
  const updatedCategories = [];
  for (const category of newCategories) {
    const result = await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        imageUrl: category.imageUrl,
      },
      create: category,
    });
    updatedCategories.push(result);
    console.log(`✅ ${category.name}`);
  }

  // List old categories that are not in the new list
  const oldCategoryNames = existingCategories
    .map(cat => cat.name)
    .filter(name => !newCategories.some(newCat => newCat.name === name));

  if (oldCategoryNames.length > 0) {
    console.log(`\n⚠️  Found ${oldCategoryNames.length} old categories that are not in the new list:`);
    oldCategoryNames.forEach(name => console.log(`   - ${name}`));
    console.log('\nNote: These categories will remain in the database.');
    console.log('If you want to delete them, you can do so manually from the admin panel.');
  }

  console.log(`\n✅ Successfully updated ${updatedCategories.length} categories!`);
  console.log('\nThe new categories are now available in your admin panel.');
}

main()
  .catch((e) => {
    console.error('❌ Error updating categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

