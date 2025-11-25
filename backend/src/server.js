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
app.put('/books/:id', async (req, res) => {
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
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        isbn,
        authorId: authorRecord.id,
        genres: {
          set: [{ id: genreRecord.id }]
        }
      },
      include: {
        author: true,
        genres: true
      }
    });

    res.json({
      id: updatedBook.id,
      title: updatedBook.title,
      isbn: updatedBook.isbn,
      author: updatedBook.author.name,
      genre: updatedBook.genres.map(g => g.name).join(', ')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update book" });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    await prisma.book.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});