const express = require('express');
const Expense = require('../models/expense.schema');

const router = express.Router();

router.get('/create', (req, res) => {
  res.render('create');
});

router.post('/create', async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.redirect('create');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get('/show', async (req, res) => {
  try {
    const expense = await Expense.find();
    res.render('show', { expense });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get('/details/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    res.render('details', { expense });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get('/delete/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.redirect('/expense/show');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get('/update/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    res.render('update', { expense });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.post('/update/:id', async (req, res) => {
  try {
    await Expense.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/expense/show');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;
