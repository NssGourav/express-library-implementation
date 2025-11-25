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

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.post('/books', async (req, res) => {
  const { title, isbn, authorId, genreIds } = req.body;

  try {
    const newBook = await prisma.book.create({
      data: {
        title,
        isbn,
        authorId,
        genres: {
          connect: genreIds.map(id => ({ id }))
        }
      },
      include: {
        genres: true
      }
    });

    res.json(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create book" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
