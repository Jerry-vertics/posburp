const asyncHandler =require('express-async-handler');
const Foodmenu =require('../models/foodmenuModel');
const foodcategory =require('../models/foodcategoryModel');
const Ingredients =require('../models/ingredientsModel');
const vat =require('../models/vatModel');
const { default: mongoose } = require("mongoose");
const CsvParser =require('json2csv').Parser;
var csv =require('csvtojson');
const fs = require('fs');

const Schema = mongoose.Schema;
const itemSchema = new Schema({ data: String });



const getfoodCategory =asyncHandler(async (req,res) =>{
    try {
        const getfoodcat = await foodcategory.find();
        res.json(getfoodcat);
      } catch (error) {
        throw new Error(error);
      }

});

const getingredients =asyncHandler(async (req,res) =>{
    try {
        const geting = await Ingredients.find();
        res.json(geting);
      } catch (error) {
        throw new Error(error);
      }

});

const getvat =asyncHandler(async(req,res) =>{
    try {
        const getvat = await vat.find();
        res.json(getvat);
      } catch (error) {
        throw new Error(error);
      }
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // The directory where files will be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Use the original filename
//   },
// });

// const upload = multer({ storage: storage });


// const creatFoodmenu =asyncHandler(async(req,res) =>{

//   const foodmenuname =req.body.foodmenuname;
//   // const upload = multer({ storage }).single("photo");
//   const findFoodmenu =await Foodmenu.findOne({ foodmenuname:foodmenuname });
//   if(!findFoodmenu)
//   {
//       //Create a new User
//       const newFoodcategory =Foodmenu.create(req.body);
//       res.json(newFoodcategory);
//   }
//   else{

//       throw new Error("Foodmenu Name Already Exist");

//   }



// });



const creatFoodmenu =asyncHandler(async(req,res) =>{

  const {filename} = req.file;
  const {foodmenuname,foodcategoryId,vatId,salesprice,description,vegitem,beverage,bar,foodingredientId} = req.body;
  const foodmenus =req.body.foodmenuname;

  // const upload = multer({ storage }).single("photo");
  const findFoodmenu =await Foodmenu.findOne({ foodmenuname:foodmenus });
  if(!findFoodmenu)
  {
    try{
      //Create a new User
      // const newFoodcategory =Foodmenu.create(req.body);
      // res.json(newFoodcategory);

      const foodmenu = new Foodmenu({
        foodmenuname:foodmenuname,
        foodcategoryId:foodcategoryId,
        vatId:vatId,
        salesprice:salesprice,
        description:description,
        vegitem:vegitem,
        beverage:beverage,
        bar:bar,
        foodingredientId:foodingredientId,
        photo:filename,

    });

    const finaldata = await foodmenu.save();

    res.json(finaldata);
  }
  catch (error) {
    res.status(401).json({status:401,error})
}
  }
  else{

      throw new Error("Foodmenu Name Already Exist");

  }


});



const getallfoods =asyncHandler(async(req,res) =>{


  try {
    const foodmenu = await Foodmenu.aggregate([
      {
        $lookup: {
          from: 'foodcategories',
          localField: 'foodcategoryId',
          foreignField: '_id',
          as: 'foodcategory',
        },
      },
      {
        $unwind: '$foodcategory',
      },
      {
        $lookup: {
          from: 'vats',
          localField: 'vatId',
          foreignField: '_id',
          as: 'vat',
        },
      },
      {
        $unwind: '$vat',
      },
    ]);
    const base64Data = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWN...";

    res.json(foodmenu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }

});


const editfoodmenu =asyncHandler(async(req,res) =>{
  const { id } =req.params;

  //console.log(id);
  try
  {
       const getcat =await Foodmenu.findById(id);
       res.json(getcat);

  }catch(error)
  {
   throw new Error(error);
  }
});

const updateFoodmenu =asyncHandler(async(req,res) =>{

  const { id } = req.params;

  const { filename } = req.file || {};
  const {foodmenuname,foodcategoryId,vatId,salesprice,description,vegitem,beverage,bar,foodingredientId} = req.body;

  // const upload = multer({ storage }).single("photo");


    try{
      const existingFoodmenu = await Foodmenu.findById(id);

      if (!existingFoodmenu) {
        return res.status(404).json({ status: 404, error: 'Foodmenu not found' });
      }

      // Update the food menu fields
      existingFoodmenu.foodmenuname = foodmenuname;
      existingFoodmenu.foodcategoryId = foodcategoryId;
      existingFoodmenu.vatId = vatId;
      existingFoodmenu.salesprice = salesprice;
      existingFoodmenu.description = description;
      existingFoodmenu.vegitem = vegitem;
      existingFoodmenu.beverage = beverage;
      existingFoodmenu.bar = bar;
      existingFoodmenu.foodingredientId = foodingredientId;
     // existingFoodmenu.photo = filename;
     if (filename) {
      existingFoodmenu.photo = filename;
    }

      // Save the updated food menu
      const updatedFoodmenu = await existingFoodmenu.save();

      res.json(updatedFoodmenu);






  }
  catch (error) {
    res.status(401).json({status:401,error})
}



});


const exportfoodmenu = asyncHandler(async (req, res) => {
  try {
    let foods = [];

    // Use await to ensure the data is retrieved before processing
    var foodmenuData = await Foodmenu.find({});

    foodmenuData.forEach((food) => {
      const {
        id,
        foodmenuname,
        foodcategoryId,
        foodingredientId,
        salesprice,
        vatId,
        description,
        vegitem,
        beverage,
        bar,
        photo,
      } = food; // Corrected variable name from 'foods' to 'food'
      foods.push({
        id,
        foodmenuname,
        foodcategoryId,
        foodingredientId,
        salesprice,
        vatId,
        description,
        vegitem,
        beverage,
        bar,
        photo,
      });
    });

    const csvFields = [
      'Id',
      'FoodmenuName',
      'FoodCategoryId',
      'FoodIngredientId',
      'SalesPrice',
      'VatId',
      'Description',
      'VegItem',
      'Beverage',
      'Bar',
      'Photo',
    ];
    const csvParser = new CsvParser({ csvFields });

    // Use 'csvParser.parse()' instead of 'csvParser.push()'
    const csvData = csvParser.parse(foods);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=foodmenu.csv');

    // Send the CSV data in the response
    res.status(200).send(csvData);
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

const importFoodmenu = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 400, message: 'No file uploaded' });
    }

    const existingFoodNames = new Set();
    const importedFoodmenu = [];
    const duplicateFoodmenu = [];

    // Use promise wrapper for CSV parsing
    const parseCSV = () => {
      return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(req.file.path) // This requires 'fs'
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      });
    };

    const response = await parseCSV();

    for (var x = 0; x < response.length; x++) {
      const foodName = response[x].foodmenuname;

      // Skip empty food names
      if (!foodName || foodName.trim() === '') {
        duplicateFoodmenu.push({ foodmenuname: 'Empty name', reason: 'Food name is empty' });
        continue;
      }

      // Check if the food name already exists in current batch
      if (existingFoodNames.has(foodName)) {
        duplicateFoodmenu.push({ foodmenuname: foodName, reason: 'Duplicate entry in file' });
        continue;
      }

      existingFoodNames.add(foodName);

      const existingFood = await Foodmenu.findOne({
        foodmenuname: { $regex: new RegExp(`^${foodName}$`, 'i') },
      });

      if (!existingFood) {
        try {
          // Parse foodingredientId safely
          let foodingredientId = [];
          try {
            const ingredientStr = response[x].foodingredientId || '';
            if (ingredientStr && ingredientStr !== '[]' && ingredientStr !== '[""[{}]""]') {
              // Clean up the string
              let cleanStr = ingredientStr;
              // Extract IDs using regex for MongoDB ObjectIds
              const idMatches = cleanStr.match(/[a-f0-9]{24}/g);
              if (idMatches && idMatches.length > 0) {
                foodingredientId = idMatches;
              } else {
                try {
                  const parsed = JSON.parse(cleanStr);
                  if (Array.isArray(parsed)) {
                    foodingredientId = parsed;
                  }
                } catch (e) {
                  console.log('Parse error:', e);
                }
              }
            }
          } catch (parseError) {
            console.log(`Error parsing ingredients for ${foodName}:`, parseError);
            foodingredientId = [];
          }

          const newFood = new Foodmenu({
            foodmenuname: foodName,
            foodcategoryId: response[x].foodcategoryId || null,
            foodingredientId: foodingredientId,
            salesprice: parseFloat(response[x].salesprice) || 0,
            vatId: response[x].vatId || null,
            description: response[x].description || '',
            vegitem: response[x].vegitem === 'yes' ? 'yes' : 'no',
            beverage: response[x].beverage === 'yes' ? 'yes' : 'no',
            bar: response[x].bar === 'yes' ? 'yes' : 'no',
            photo: response[x].photo || '',
          });

          const savedFood = await newFood.save();
          importedFoodmenu.push(savedFood);
        } catch (saveError) {
          console.error(`Error saving food ${foodName}:`, saveError);
          duplicateFoodmenu.push({
            foodmenuname: foodName,
            reason: saveError.message
          });
        }
      } else {
        duplicateFoodmenu.push({
          foodmenuname: foodName,
          reason: 'Already exists in database'
        });
      }
    }

    // Clean up the uploaded file
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Send response with both arrays
    res.json({
      status: 200,
      importedCount: importedFoodmenu.length,
      duplicateCount: duplicateFoodmenu.length,
      importedFoodmenu: importedFoodmenu,
      duplicateFoodmenu: duplicateFoodmenu,
      message: `Successfully imported ${importedFoodmenu.length} items. ${duplicateFoodmenu.length} duplicates found.`
    });

  } catch (error) {
    console.error('Import error:', error);
    // Clean up file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({ status: 500, error: error.message });
  }
});

const updateFoodMenuStatus = async (req, res) => {
  try {
    // Update all documents that do not have a status field
    const result = await Foodmenu.updateMany(
      { status: { $exists: false } }, // Check if the status field does not exist
      { $set: { status: 0 } }         // Set the default value 0 for status
    );

    // If no documents were updated
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "No documents were updated." });
    }

    res.status(200).json({ message: "All documents updated successfully!" });
  } catch (err) {
    console.error("Error updating documents:", err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const deActivatefoodmenu = async (req, res) => {
  const { id } =req.params;

    try
    {
      let status = "1";
      const updateResult = await Foodmenu.updateOne(
        { _id: id },
        {
          $set: {
            status: status,

          },
        }
      );

        res.json(updateResult);
    }
    catch(error)
    {
        throw new Error(error);
    }

};




const activatefoodmenu =asyncHandler(async(req,res) =>{

  const { id } =req.params;

  try
  {
    let status = "0";
    const updateResult = await Foodmenu.updateOne(
      { _id: id },
      {
        $set: {
          status: status,

        },
      }
    );

      res.json(updateResult);
  }
  catch(error)
  {
      throw new Error(error);
  }
})




module.exports = {getfoodCategory,
  getingredients,
  getvat,
  creatFoodmenu,
  getallfoods,
  editfoodmenu,
  updateFoodmenu,
  exportfoodmenu,
  importFoodmenu,
  updateFoodMenuStatus,
  deActivatefoodmenu,
  activatefoodmenu
};