const express = require('express');
const Expense = require('../models/expense.schema');
const { isLoggedIn } = require('../utils/auth.middileware');
const router = express.Router();

router.get('/create', (req, res) => {
  res.render('create', { title: 'Create Expense', user: req.user });
});

router.post('/create', isLoggedIn, async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.redirect('create');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get('/show', isLoggedIn, async (req, res) => {
  try {
    const expense = await Expense.find();
    res.render('show', { title: 'Show Expense', expense, user: req.user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get('/details/:id', isLoggedIn, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    res.render('details', {
      title: 'Expense Details',
      expense,
      user: req.user,
    });
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
    res.render('update', { title: 'Update Expense', expense, user: req.user });
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
