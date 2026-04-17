const asyncHandler =require('express-async-handler');
const Balance =require('../models/openningbalanceModel')
const Transaction =require('../models/acctransactionModel');
const User =require('../models/userModel');

const createBalance = asyncHandler(async (req, res) => {
  const { amount, addedby, shiftstoken } = req.body;

  // Validate required fields
  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  if (!addedby) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!shiftstoken) {
    return res.status(400).json({ error: 'Shift token is required' });
  }

  try {
    // Check if amount is valid number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: 'Please enter a valid amount greater than 0' });
    }

    // Check if there's already an active opening balance for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingBalance = await Balance.findOne({
      date: { $gte: today, $lt: tomorrow },
      status: "Active"
    });

    if (existingBalance) {
      return res.status(400).json({
        error: 'An opening balance already exists for today'
      });
    }

    // Rest of your code remains the same...
    const latestBalance = await Balance.findOne({}).sort('-openningbalancenumber');
    let nextIdNumber = 'OB10001';

    if (latestBalance && latestBalance.openningbalancenumber) {
      const lastIdNumber = latestBalance.openningbalancenumber;
      const numericPart = lastIdNumber.substring(2);
      const nextNumericValue = parseInt(numericPart, 10) + 1;
      nextIdNumber = `OB${nextNumericValue.toString().padStart(5, '0')}`;
    }

    const newEntry = new Balance({
      openningbalancenumber: nextIdNumber,
      amount: amount,
      addedby: addedby,
      shiftstoken: shiftstoken,
      shiftacess: nextIdNumber,
    });

    const savedEntry = await newEntry.save();

    // Transaction creation
    const sequence = await Transaction.findOne({}).sort('-transnumber');
    let newTransNumber = 'TR10001';

    if (sequence && sequence.transnumber) {
      const lastIdNumber = sequence.transnumber;
      const numericPart = lastIdNumber.substring(2);
      const nextNumericValue = parseInt(numericPart, 10) + 1;
      newTransNumber = `TR${nextNumericValue.toString().padStart(5, '0')}`;
    }

    let transtype = "Debit";
    let transmode = "Openning Balance";

    const newTransaction = new Transaction({
      accountsid: savedEntry._id,
      transnumber: newTransNumber,
      transmode: transmode,
      amount: amount,
      transtype: transtype,
      shiftstoken: shiftstoken,
      shiftacess: nextIdNumber,
    });

    await newTransaction.save();

    const updateUser = await User.findByIdAndUpdate(
      addedby,
      { shiftacess: nextIdNumber },
      { new: true }
    );

    res.status(201).json(savedEntry);
  } catch (error) {
    console.error('Error completing opening balance:', error);

    if (error.code === 11000) {
      if (error.keyPattern?.openningbalancenumber) {
        return res.status(400).json({ error: 'ID number already exists' });
      }
      if (error.keyPattern?.amount) {
        return res.status(400).json({ error: 'This amount has already been used today. Please use a different amount.' });
      }
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// const checkBalance = asyncHandler(async (req, res) => {
//     const today = new Date().toISOString().split('T')[0];

//     try {
//       // const result = await Balance.findOne({
//       //   date: { $gte: new Date(today), $lt: new Date(today + 'T23:59:59.999Z') },
//       // });
//       const result = await Balance.findOne({
//         date: { $gte: new Date(today), $lt: new Date(today + 'T23:59:59.999Z') },
//         status: "Active",
//       });

//       if (result) {
//         res.json({ hasOpeningBalance: true, openingBalance: result });
//       } else {
//         res.json({ hasOpeningBalance: false });
//       }
//     } catch (error) {
//       console.error('Error checking opening balance:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

const checkBalance = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to 00:00:00.000 (midnight)

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Move to the next day
  tomorrow.setHours(tomorrow.getHours() + 1); // Add one hour

  try {
    const result = await Balance.findOne({
      date: { $gte: today, $lt: tomorrow },
      status: "Active",
    });

    if (result) {
      res.json({ hasOpeningBalance: true, openingBalance: result });
    } else {
      res.json({ hasOpeningBalance: false });
    }
  } catch (error) {
    console.error('Error checking opening balance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports={createBalance,checkBalance}