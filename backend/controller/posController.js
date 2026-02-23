const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const foodcategory = require("../models/foodcategoryModel");
const Waiter = require("../models/waiterModel");
const Table = require("../models/tableModel");
const Customer = require("../models/customerModel");
const Foodmenu = require("../models/foodmenuModel");
const Pos = require("../models/posModels");
const Delivery = require("../models/deliveryModel");
const OrderTable = require("../models/ordertableModel");
const Payment = require("../models/paymentModel");
const Transaction = require("../models/acctransactionModel");
const User =require('../models/userModel');

//Food Category
const getposCategory = asyncHandler(async (req, res) => {
  try {
    const getfoodcat = await foodcategory.find();
    res.json(getfoodcat);
  } catch (error) {
    throw new Error(error);
  }
});

//Waiter Modal
// const getPosWaiter = asyncHandler(async (req, res) => {
//   try {
//     const getWaiter = await Waiter.find();
//     res.json(getWaiter);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const getPosWaiter = asyncHandler(async (req, res) => {
  try {
    const getWaiter = await User.find({ userrole: "Waiter" });
    res.json(getWaiter);
  } catch (error) {
    throw new Error(error);
  }
});
//Customer Model
const getCustomer = asyncHandler(async (req, res) => {
  try {
    const getCustomer = await Customer.find();
    res.json(getCustomer);
  } catch (error) {
    throw new Error(error);
  }
});
//Table Model
const getTable = asyncHandler(async (req, res) => {
  try {
    const getTable = await Table.find();
    res.json(getTable);
  } catch (error) {
    throw new Error(error);
  }
});

const getDelivery = asyncHandler(async (req, res) => {
  try {
    //const getDelivery = await Delivery.find();
    const getDelivery = await User.find({ userrole: "Delivery" });
    res.json(getDelivery);
  } catch (error) {
    throw new Error(error);
  }
});

const getposFooditems = asyncHandler(async (req, res) => {
  try {
    const posfoodmenu = await Foodmenu.aggregate([
      {
        $lookup: {
          from: "foodcategories",
          localField: "foodcategoryId",
          foreignField: "_id",
          as: "foodcategory",
        },
      },
      {
        $unwind: "$foodcategory",
      },
      {
        $lookup: {
          from: "vats",
          localField: "vatId",
          foreignField: "_id",
          as: "vat",
        },
      },
      {
        $unwind: "$vat",
      },
    ]);

    res.json(posfoodmenu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const insertPos = asyncHandler(async (req, res) => {
  try {
    const {
      customers,
      options,
      grandTotal,
      cart,
      vatAmount,
      total,
      foodoption,
      waiterId,
      tableId,
      delivery,
      numberofperson,
      addedby,
      opentoken,
    } = req.body;
    // console.log(req.body);

    const sequence = await Pos.findOne({}).sort("-ordernumber"); // Find the latest ID

    let nextIdNumber = "ORD10001";

    if (sequence && sequence.ordernumber) {
      const lastIdNumber = sequence.ordernumber;
      const numericPart = lastIdNumber.substring(3); // Adjust the starting index
      const nextNumericValue = parseInt(numericPart, 10) + 1;
      nextIdNumber = `ORD${nextNumericValue.toString().padStart(5, "0")}`;
    }

    // Check if the ID number already exists
    const exists = await Pos.findOne({ ordernumber: nextIdNumber });

    if (exists) {
      return res.status(400).json({ error: "ID number already exists" });
    }
    let paymentstatus = "notpaid";

    const newEntry = new Pos({
      ordernumber: nextIdNumber,
      customers: customers,
      options: foodoption,
      cart: cart,
      total: total,
      grandTotal: grandTotal,
      vatAmount: vatAmount,
      waiterId: waiterId,
      tableId: tableId,
      paymentstatus: paymentstatus,
      delivery: delivery,
      addedby: addedby,
      opentoken:opentoken,
    });

    const finaldata = await newEntry.save();

    if (tableId !== null && tableId !== undefined && tableId !== "") {
      let orderstatus = "Pending";
      const Tableorder = new OrderTable({
        orderId: finaldata._id,
        ordertableId: tableId,
        numberofperson: numberofperson,
        orderstatus: orderstatus,
      });
      await Tableorder.save();
    }

    res.json(finaldata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while inserting data" });
  }
});

const updatePayment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentType, total, vatAmount, grandTotal,addedby,shiftstoken,opentoken } = req.body;
    let paymentstatus = "paid";
    const updateResult = await Pos.updateOne(
      { _id: id },
      {
        $set: {
          paymentstatus: paymentstatus,
          paymentType,
        },
      }
    );

    if (updateResult.nModified === 0) {
      return res.status(404).json({ error: "No matching document found" });
    }

    let orderstatus = "Complete";

    const updateorderTable = await OrderTable.updateOne(
      { orderId: id },
      {
        $set: {
          orderstatus: orderstatus,
        },
      }
    );

    const sequence = await Payment.findOne({}).sort("-bilnumber"); // Find the latest ID

    let nextIdNumber = "BIL10001";

    if (sequence && sequence.bilnumber) {
      const lastIdNumber = sequence.bilnumber;
      const numericPart = lastIdNumber.substring(3); // Adjust the starting index
      const nextNumericValue = parseInt(numericPart, 10) + 1;
      nextIdNumber = `BIL${nextNumericValue.toString().padStart(5, "0")}`;
    }

    // Check if the ID number already exists
    const exists = await Payment.findOne({ bilnumber: nextIdNumber });

    if (exists) {
      return res.status(400).json({ error: "ID number already exists" });
    }
    let paystatus = "Paid";
    const cashpayment = new Payment({
      bilnumber: nextIdNumber,
      orderId: id,
      total: total,
      vatAmount: vatAmount,
      grandTotal: grandTotal,
      paymentType: paymentType,
      addedby:addedby,
      shiftstoken:shiftstoken,
      opentoken:opentoken,
      status:paystatus,
    });

    const finaldata = await cashpayment.save();

    const trans = await Transaction.findOne({}).sort("-transnumber");

    let transIdnumber = "TR10001";

    if (trans && trans.transnumber) {
      const lastIdNumber = trans.transnumber;
      const numericPart = lastIdNumber.substring(2);
      const nextNumericValue = parseInt(numericPart, 10) + 1;
      transIdnumber = `TR${nextNumericValue.toString().padStart(5, "0")}`;
    }

    const exist = await Transaction.findOne({ transnumber: transIdnumber });

    if (exist) {
      return res.status(400).json({ error: "ID number already exists" });
    }

    let transtype = "Credit";
    let transmode = "Food Bill";
    let transtatus = "Paid";

    const newEntry = new Transaction({
      accountsid: finaldata._id,
      transnumber: transIdnumber,
      transmode: transmode,
      amount: grandTotal,
      transtype: transtype,
      shiftstoken:shiftstoken,
      opentoken:opentoken,
      transtatus:transtatus,
    });
    await newEntry.save();


    const updateBill = await Pos.updateOne(
      { _id: id },
      {
        $set: {
          billnumber: nextIdNumber,

        },
      }
    );


    const updatedDocument = await Pos.findById(id);

    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const insertPoshold = asyncHandler(async (req, res) => {
  try {
    const {
      customers,
      options,
      grandTotal,
      cart,
      vatAmount,
      total,
      foodoption,
      waiterId,
      tableId,
      delivery,
    } = req.body;
    // console.log(req.body);

    const sequence = await Pos.findOne({}).sort("-ordernumber"); // Find the latest ID

    let nextIdNumber = "ORD10001";

    if (sequence && sequence.ordernumber) {
      const lastIdNumber = sequence.ordernumber;
      const numericPart = lastIdNumber.substring(3); // Adjust the starting index
      const nextNumericValue = parseInt(numericPart, 10) + 1;
      nextIdNumber = `ORD${nextNumericValue.toString().padStart(5, "0")}`;
    }
    // Check if the ID number already exists
    const exists = await Pos.findOne({ ordernumber: nextIdNumber });

    if (exists) {
      return res.status(400).json({ error: "ID number already exists" });
    }
    let hold = "hold";

    const newEntry = new Pos({
      ordernumber: nextIdNumber,
      customers: customers,
      options: foodoption,
      cart: cart,
      total: total,
      grandTotal: grandTotal,
      vatAmount: vatAmount,
      waiterId: waiterId,
      tableId: tableId,
      hold: hold,
      delivery: delivery,
    });
    await newEntry.save();

    res.json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while inserting data" });
  }
});

const getHold = asyncHandler(async (req, res) => {
  try {
    const holdingorder = await Pos.aggregate([
      {
        $match: {
          hold: "hold",
        },
      },

      {
        $lookup: {
          from: "tables",
          localField: "tableId",
          foreignField: "_id",
          as: "table",
        },
      },
      {
        //$unwind: '$table',
        $unwind: {
          path: "$table",
          preserveNullAndEmptyArrays: true, // Keep customerDetails even if it's null
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "waiterId",
          foreignField: "_id",
          as: "waiter",
        },
      },
      {
        $unwind: "$waiter",
      },
    ]);
    res.json(holdingorder);
    // Use Mongoose to find orders where paymentstatus is "notpaid"
    // const notPaidOrders = await Pos.find({ paymentstatus: 'notpaid' });

    // res.json(notPaidOrders);
  } catch (error) {
    console.error('Error fetching "notpaid" orders:', error);
  }
});

const todayOrder = asyncHandler(async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayorder = await Pos.aggregate([
      {
        $match: {
          paymentstatus: "paid",
          date: {
            $gte: today, // Greater than or equal to the beginning of the day
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Less than the beginning of the next day
          },
        },
      },

      {
        $lookup: {
          from: "tables",
          localField: "tableId",
          foreignField: "_id",
          as: "table",
        },
      },
      {
        //$unwind: '$table',
        $unwind: {
          path: "$table",
          preserveNullAndEmptyArrays: true, // Keep customerDetails even if it's null
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "waiterId",
          foreignField: "_id",
          as: "waiter",
        },
      },
      {
        $unwind: "$waiter",
      },

      {
        $lookup: {
          from: "users",
          localField: "addedby",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    res.json(todayorder);
  } catch (error) {
    console.error('Error fetching "notpaid" orders:', error);
  }
});

const insertQuickpay = asyncHandler(async (req, res) => {
  try {
    const {
      customers,
      options,
      grandTotal,
      cart,
      vatAmount,
      total,
      foodoption,
      waiterId,
      tableId,
      delivery,
      addedby,
      shiftstoken,
      opentoken,
    } = req.body;
    // console.log(req.body);

    const sequence = await Pos.findOne({}).sort("-ordernumber"); // Find the latest ID

    let nextIdNumber = "ORD10001";

    if (sequence && sequence.ordernumber) {
      const lastIdNumber = sequence.ordernumber;
      const numericPart = lastIdNumber.substring(3); // Adjust the starting index
      const nextNumericValue = parseInt(numericPart, 10) + 1;
      nextIdNumber = `ORD${nextNumericValue.toString().padStart(5, "0")}`;
    }

    // Check if the ID number already exists
    const exists = await Pos.findOne({ ordernumber: nextIdNumber });

    if (exists) {
      return res.status(400).json({ error: "ID number already exists" });
    }
    let paymentstatus = "paid";

    const newEntry = new Pos({
      ordernumber: nextIdNumber,
      customers: customers,
      options: foodoption,
      cart: cart,
      total: total,
      grandTotal: grandTotal,
      vatAmount: vatAmount,
      waiterId: waiterId,
      tableId: tableId,
      paymentstatus: paymentstatus,
      delivery: delivery,
      addedby: addedby,
      opentoken:opentoken,
    });
    const quick = await newEntry.save();

    const orderbill = await Payment.findOne({}).sort("-bilnumber"); // Find the latest ID

    let billIdnumber = "BIL10001";

    if (orderbill && orderbill.bilnumber) {
      const lastIdNumber = orderbill.bilnumber;
      const numericPart = lastIdNumber.substring(3); // Adjust the starting index
      const nextNumericValue = parseInt(numericPart, 10) + 1;
      billIdnumber = `BIL${nextNumericValue.toString().padStart(5, "0")}`;
    }

    // Check if the ID number already exists
    const exist = await Payment.findOne({ bilnumber: billIdnumber });

    if (exist) {
      return res.status(400).json({ error: "ID number already exists" });
    }
    let paymentType = "Cash";
    let paystatus ="Paid";

    const cashpayment = new Payment({
      bilnumber: billIdnumber,
      orderId: quick._id,
      total: total,
      vatAmount: vatAmount,
      grandTotal: grandTotal,
      paymentType: paymentType,
      addedby:addedby,
      shiftstoken:shiftstoken,
      opentoken:opentoken,
      status:paystatus,
    });

    const finaldata = await cashpayment.save();

    const trans = await Transaction.findOne({}).sort("-transnumber");

    let transIdnumber = "TR10001";

    if (trans && trans.transnumber) {
      const lastIdNumber = trans.transnumber;
      const numericPart = lastIdNumber.substring(2);
      const nextNumericValue = parseInt(numericPart, 10) + 1;
      transIdnumber = `TR${nextNumericValue.toString().padStart(5, "0")}`;
    }

    const transz = await Transaction.findOne({ transnumber: transIdnumber });

    if (transz) {
      return res.status(400).json({ error: "ID number already exists" });
    }

    let transtype = "Credit";
    let transmode = "Food Bill";
    let transtatus ="Paid";

    const newTransaction = new Transaction({
      accountsid: finaldata._id,
      transnumber: transIdnumber,
      transmode: transmode,
      amount: grandTotal,
      transtype: transtype,
      transtatus:transtatus,

    });
    await newTransaction.save();

    const updateBill = await Pos.updateOne(
      { _id: quick._id },
      {
        $set: {
          billnumber: billIdnumber,
        },
      }
    );

    // Find the updated document
    const updatedDocuments = await Pos.findById(quick._id);


    //const updatedDocument = await Pos.findById(id);


   // res.json(newEntry,updateBill);
   res.json({ newEntry, updatedDocuments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while inserting data" });
  }
});

const tableorder = asyncHandler(async (req, res) => {
  try {
    const result = await Table.aggregate([
      {
        $lookup: {
          from: "ordertables",
          localField: "_id",
          foreignField: "ordertableId",
          as: "orderData",
        },
      },
      {
        $unwind: {
          path: "$orderData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          tablename: { $first: "$tablename" },
          Position: { $first: "$Position" },
          seatcapacity: { $first: "$seatcapacity" },
          description: { $first: "$description" },
          orderstatus: { $first: "$orderData.orderstatus" },
          subtractedValue: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$orderData", null] },
                    { $eq: ["$orderData.orderstatus", "Pending"] },
                  ],
                },
                then: {
                  $cond: {
                    if: {
                      $gte: [
                        { $toInt: "$seatcapacity" },
                        { $toInt: "$orderData.numberofperson" },
                      ],
                    },
                    then: { $toInt: "$orderData.numberofperson" },
                    else: { $toInt: "$seatcapacity" },
                  },
                },
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          tablename: 1,
          Position: 1,
          seatcapacity: 1,
          description: 1,
          orderstatus: 1,
          subtractedValue: 1,
          availableSeat: {
            $subtract: [{ $toInt: "$seatcapacity" }, "$subtractedValue"],
          },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const calculateTable = asyncHandler(async (req, res) => {
  try {
    const result = await Table.aggregate([
      {
        $lookup: {
          from: "ordertables",
          localField: "_id",
          foreignField: "ordertableId",
          as: "orderData",
        },
      },
      {
        $unwind: {
          path: "$orderData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          tablename: { $first: "$tablename" },
          Position: { $first: "$Position" },
          seatcapacity: { $first: "$seatcapacity" },
          description: { $first: "$description" },
          orderstatus: { $first: "$orderData.orderstatus" },
          subtractedValue: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$orderData", null] },
                    { $eq: ["$orderData.orderstatus", "Pending"] },
                  ],
                },
                then: {
                  $cond: {
                    if: {
                      $gte: [
                        { $toInt: "$seatcapacity" },
                        { $toInt: "$orderData.numberofperson" },
                      ],
                    },
                    then: { $toInt: "$orderData.numberofperson" },
                    else: { $toInt: "$seatcapacity" },
                  },
                },
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          tablename: 1,
          Position: 1,
          seatcapacity: 1,
          description: 1,
          orderstatus: 1,
          subtractedValue: 1,
          availableSeat: {
            $subtract: [{ $toInt: "$seatcapacity" }, "$subtractedValue"],
          },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const getorders =asyncHandler(async(req,res) =>{
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    const pos = await Pos.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id), // Match documents with the specified _id
        },
      },
      {
        $unwind: "$cart" // Flatten the cart array
      },
      {
        $lookup: {
          from: "foodmenus",
          localField: "cart.foodmenuId",
          foreignField: "_id",
          as: "menuItemDetails"
        },
      },
      {
        $unwind: "$menuItemDetails" // Unwind the menuItemDetails array
      },
      {
        $lookup: {
          from: "customers",
          localField: "customers",
          foreignField: "_id",
          as: "customerDetails"
        },
      },
      {
        $unwind: {
          path: "$customerDetails",
          preserveNullAndEmptyArrays: true // Keep customerDetails even if it's null
        },
      },
      {
        $lookup: {
          from: "waiters",
          localField: "waiterId",
          foreignField: "_id",
          as: "waiterDetails"
        },
      },
      {
        $unwind: "$waiterDetails"
      },
      {
        $lookup: {
          from: "tables",
          localField: "tableId",
          foreignField: "_id",
          as: "tableDetails"
        },
      },
      {
        // $unwind: "$tableDetails"
        $unwind: {
          path: "$tableDetails",
          preserveNullAndEmptyArrays: true // Keep customerDetails even if it's null
        },
      },
      {
        $lookup: {
          from: "delivery",
          localField: "delivery",
          foreignField: "_id",
          as: "deliveryDetails"
        }
      },
      {
        $unwind: {
          path: "$deliveryDetails",
          preserveNullAndEmptyArrays: true // Keep customerDetails even if it's null
        }
      },
      {
        $group: {
          _id: "$_id",
          ordernumber: { $first: "$ordernumber" },
          options: { $first: "$options" },
          total: { $first: "$total" },
          grandTotal: { $first: "$grandTotal" },
          vatAmount: { $first: "$vatAmount" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          cart: {
            $push: {
              foodmenuId: "$cart.foodmenuId",
              salesprice: "$cart.salesprice",
              quantity: "$cart.quantity",
              menuItemDetails: "$menuItemDetails"
            }
          },
          customerDetails: { $first: "$customerDetails" },

          waiterDetails: { $first: "$waiterDetails" },
          deliveryDetails :{ $first : "$deliveryDetails" }
        }
      },
    ]);

    res.json(pos);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
})


const updateTable = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    let orderstatus = "Complete";

    const updateorderTable = await OrderTable.updateOne(
      { orderId: id },
      {
        $set: {
          orderstatus: orderstatus,
        },
      }
    );

    if (updateorderTable.nModified === 0) {
      return res.status(404).json({ error: "No matching order found" });
    }

    res.json({ message: "Order table updated successfully", orderstatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = {
  getposCategory,
  getPosWaiter,
  getCustomer,
  getTable,
  getDelivery,
  getposFooditems,
  insertPos,
  updatePayment,
  insertPoshold,
  getHold,
  todayOrder,
  insertQuickpay,
  tableorder,
  calculateTable,
  getorders,
  updateTable
};

