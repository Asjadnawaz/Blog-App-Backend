const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const BlogPost = require('../models/BlogPost');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Demo users
const demoUsers = [
  {
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    firstName: 'Regular',
    lastName: 'User'
  }
];

// Demo blog posts
const demoPosts = [
  {
    title: 'Getting Started with MERN Stack',
    content: 'The MERN stack is a powerful combination of technologies for building modern web applications. MERN stands for MongoDB, Express.js, React, and Node.js. This stack provides a complete solution for developing full-stack JavaScript applications.',
    published: true
  },
  {
    title: 'Understanding Object-Oriented Programming',
    content: 'Object-oriented programming (OOP) is a programming paradigm based on the concept of "objects", which can contain data and code: data in the form of fields (often known as attributes or properties), and code, in the form of procedures (often known as methods).',
    published: true
  },
  {
    title: 'Best Practices for API Design',
    content: 'Designing a good API is crucial for the success of any web application. A well-designed API is easy to use, understand, and maintain. Here are some best practices for API design that every developer should follow.',
    published: true
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await BlogPost.deleteMany({});

    console.log('Existing data cleared');

    // Create demo users
    const createdUsers = [];
    for (const userData of demoUsers) {
      const user = new User(userData);
      // Save will hash the password due to pre-save middleware
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`Created user: ${userData.email}`);
    }

    // Create demo posts
    for (let i = 0; i < demoPosts.length; i++) {
      const post = new BlogPost({
        ...demoPosts[i],
        author: createdUsers[i % createdUsers.length]._id // Alternate between users
      });
      await post.save();
      console.log(`Created post: ${demoPosts[i].title}`);
    }

    console.log('Demo data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();