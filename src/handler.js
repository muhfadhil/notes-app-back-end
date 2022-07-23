const { nanoid } = require('nanoid');
const notes = require('./notes');

// Handler untuk menyimpan data
const addNoteHandler = (req, h) => {
  const { title, tags, body } = req.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    title,
    tags,
    body,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  res.code(500);
  return res;
};

// Hnadler untuk menampilkan seluruh data
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// Handler untuk menampilkan data berdasarkan id
const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const note = notes.find((n) => n.id === id);

  if (note !== 'undefined') {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const res = h.response({
    status: 'fail',
    message: 'catatan tidak ditemukan',
  });
  res.code(404);
  return res;
};

// Handler untuk memperbarui data
const editNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const { title, tags, body } = req.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const res = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Catatan gagal diperbarui. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

// Handler untuk menghapus data
const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const res = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus.',
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
