const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/books', async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        author: true,
        genres: true
      }
    });
    const simplifiedBooks = books.map(book => ({
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      author: book.author?.name || '',
      genre: book.genres.map(g => g.name).join(', ') || ''
    }));

    res.json(simplifiedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});
