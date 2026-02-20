const asyncHandler =require('express-async-handler');
const mongoose = require('mongoose');
const foodcategory =require('../models/foodcategoryModel');
const Waiter =require('../models/waiterModel');
const Table =require('../models/tableModel');
const Customer =require('../models/customerModel');
const Foodmenu =require('../models/foodmenuModel');
const Pos  =require('../models/posModels');
const Delivery =require('../models/deliveryModel');
const OrderTable =require('../models/ordertableModel');
const Payment =require('../models/paymentModel');
const Transaction =require('../models/acctransactionModel')
const User =require('../models/userModel');

const getAllPos =asyncHandler(async(req,res) =>{
    try {
      // const getAllPos = await Pos.find();
      // res.json(getAllPos);
      const pos = await Pos.aggregate([
        {
          $unwind: "$cart" // Flatten the cart array
        },
        {
          $lookup: {
            from: "foodmenus",
            localField: "cart.foodmenuId",
            foreignField: "_id",
            as: "menuItemDetails"
          }
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
          }
        },
        {
          $unwind: {
            path: "$customerDetails",
            preserveNullAndEmptyArrays: true // Keep customerDetails even if it's null
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "waiterId",
            foreignField: "_id",
            as: "waiterDetails"
          }
        },
        {
          $unwind: "$waiterDetails"
        },
        {
          $lookup: {
            from: "users",
            localField: "addedby",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $unwind: "$userDetails"
        },
        {
          $lookup: {
            from: "tables",
            localField: "tableId",
            foreignField: "_id",
            as: "tableDetails"
          }
        },
        {
          // $unwind: "$tableDetails"
          $unwind: {
            path: "$tableDetails",
            preserveNullAndEmptyArrays: true // Keep customerDetails even if it's null
          }
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
            ordernumber:{$first: "$ordernumber"},
            options: { $first: "$options" },
            date :{$first: "$date"},
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
            userDetails:{$first:"$userDetails"},

            deliveryDetails:{
              $first:"$deliveryDetails"
            },

          }
        }

      ]);

      res.json(pos);
    } catch (error) {
      throw new Error(error);
    }
  });


const completePaymeny = asyncHandler(async(req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    const pos = await Pos.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $unwind: "$cart"
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
        $unwind: "$menuItemDetails"
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
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $lookup: {
          from: "users",
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
        $unwind: {
          path: "$tableDetails",
          preserveNullAndEmptyArrays: true
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
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$_id",
          ordernumber: { $first: "$ordernumber" },
          options: { $first: "$options" },
          date: { $first: "$date" },
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
          deliveryDetails: { $first: "$deliveryDetails" },
          tableDetails: { $first: "$tableDetails" }  // Added this line
        }
      },
    ]);

    res.json(pos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


  const paidorders =asyncHandler(async(req,res) =>{

    try {



      const matchCriteria = {
          paymentstatus: 'paid',
          // Add other match criteria as needed
        };


      const posinvoice = await Pos.aggregate([
          {
              $match: matchCriteria,
            },

        {
          $lookup: {
            from: 'tables',
            localField: 'tableId',
            foreignField: '_id',
            as: 'table',
          },
        },
        {
          //$unwind: '$table',
          $unwind: {
            path: "$table",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'waiterId',
            foreignField: '_id',
            as: 'waiter',
          },
        },
        {
          $unwind: '$waiter',
        },

        {
          $lookup: {
            from: 'users',
            localField: 'addedby',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },




      ]);
      res.json(posinvoice);



    } catch (error) {
      console.error('Error fetching "notpaid" orders:', error);

    }



  });




  const cancelorders =asyncHandler(async(req,res) =>{

    try {



      const matchCriteria = {
          paymentstatus: 'Cancel',
          // Add other match criteria as needed
        };


      const posinvoice = await Pos.aggregate([
          {
              $match: matchCriteria,
            },

        {
          $lookup: {
            from: 'tables',
            localField: 'tableId',
            foreignField: '_id',
            as: 'table',
          },
        },
        {
          //$unwind: '$table',
          $unwind: {
            path: "$table",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'waiterId',
            foreignField: '_id',
            as: 'waiter',
          },
        },
        {
          $unwind: '$waiter',
        },

        {
          $lookup: {
            from: 'users',
            localField: 'addedby',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },


        {
          $lookup: {
            from: 'users',
            localField: 'cancelBy',
            foreignField: '_id',
            as: 'cancels',
          },
        },
        {
          $unwind: '$cancels',
        },




      ]);
      res.json(posinvoice);



    } catch (error) {
      console.error('Error fetching "notpaid" orders:', error);

    }



  });



  const runningorders =asyncHandler(async(req,res) =>{

    try {



      const matchCriteria = {
          paymentstatus: 'notpaid',
          // Add other match criteria as needed
        };


      const posinvoice = await Pos.aggregate([
          {
              $match: matchCriteria,
            },

        {
          $lookup: {
            from: 'tables',
            localField: 'tableId',
            foreignField: '_id',
            as: 'table',
          },
        },
        {
          //$unwind: '$table',
          $unwind: {
            path: "$table",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'waiterId',
            foreignField: '_id',
            as: 'waiter',
          },
        },
        {
          $unwind: '$waiter',
        },

        {
          $lookup: {
            from: 'users',
            localField: 'addedby',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },




      ]);
      res.json(posinvoice);



    } catch (error) {
      console.error('Error fetching "notpaid" orders:', error);

    }



  });



  module.exports = {getAllPos,completePaymeny,paidorders,cancelorders,runningorders}
