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
app.post('/books', async (req, res) => {
  const { title, isbn, author, genre } = req.body;

  try {
    let authorRecord = await prisma.author.findFirst({
      where: { name: author }
    });

    if (!authorRecord) {
      authorRecord = await prisma.author.create({
        data: { name: author }
      });
    }
    let genreRecord = await prisma.genre.findFirst({
      where: { name: genre }
    });

    if (!genreRecord) {
      genreRecord = await prisma.genre.create({
        data: { name: genre }
      });
    }
    const newBook = await prisma.book.create({
      data: {
        title,
        isbn,
        authorId: authorRecord.id,
        genres: {
          connect: [{ id: genreRecord.id }]
        }
      },
      include: {
        author: true,
        genres: true
      }
    });
    res.json({
      id: newBook.id,
      title: newBook.title,
      isbn: newBook.isbn,
      author: newBook.author.name,
      genre: newBook.genres.map(g => g.name).join(', ')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create book" });
  }
});