import React from "react";
import { useState, useEffect } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import Footer from "../layouts/Footer";
import Select from "react-select";

import axios from "axios";
import { redirect, useNavigate, useParams } from "react-router-dom";
import apiConfig from "../layouts/base_url";

const EditFoodMenu = () => {
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${apiConfig.baseURL}/api/foodmenu/ingredients`)
      .then((response) => {
        const data = response.data.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        setOptions(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const [units, setOptions] = useState([]);

  const [foodCategory, setFoodcategory] = useState([]);
 // const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiConfig.baseURL}/api/foodmenu/foodcategory`)
      .then((response) => {
        setFoodcategory(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const [vat, selectVat] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiConfig.baseURL}/api/foodmenu/vat`)
      .then((response) => {
        selectVat(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleVatChange = (event) => {
    setSelectVat(event.target.value);
  };

  const Beverages = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const vegs = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];
  const bars = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const handleVeg = (event) => {
    setVeg(event.target.value);

    //  alert({svat});
  };
  const handleBeverage = (event) => {
    setBeverage(event.target.value);
    //  alert({svat});
  };

  const handleBar = (event) => {
    setBars(event.target.value);
    //  alert({svat});
  };

  const handleFileChange = (event) => {
    //console.log(event);
    const file = event.target.files[0];
    setPhoto(file);
  };

  useEffect(() => {
    axios
      .get(`${apiConfig.baseURL}/api/foodmenu/editfoodmenu/${id}`)
      .then((res) => {
        console.log(res);
        setFoodmenuName(res.data.foodmenuname);
        setSelectedCategory(res.data.foodcategoryId);
        // setSelectedValues(res.data.foodingredientId)
        const foodIngredientIds = JSON.parse(res.data.foodingredientId[0]).map(
          (ingredient) => ({
            value: ingredient.value,
            label: ingredient.label,
          })
        );

        setSelectedValues(foodIngredientIds);
        setSalesPrice(res.data.salesprice);
        setSelectVat(res.data.vatId);

        setVeg(res.data.vegitem);
        setBeverage(res.data.beverage);
        setBars(res.data.bar);
        setDescription(res.data.description);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const [vegitem, setVeg] = useState();
  const [beverage, setBeverage] = useState();
  const [bar, setBars] = useState();
  const [foodmenuname, setFoodmenuName] = useState("");
  const [salesprice, setSalesPrice] = useState();
  const [description, setDescription] = useState();
  const [foodcategoryId, setSelectedCategory] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [vatId, setSelectVat] = useState("");
  const [photo, setPhoto] = useState("");

  //console.log(photo);
  console.log(photo);

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    var formData = new FormData();
    formData.append("photo", photo);
    formData.append("foodmenuname", foodmenuname);
    // formData.append(
    //   "foodingredientId",
    //   JSON.stringify(selectedValues.map((units) => units.value))
    // );
    const selectedInfo = selectedValues.map((unit) => ({
      label: unit.label,
      value: unit.value,
    }));
    formData.append("foodingredientId", JSON.stringify(selectedInfo));
    formData.append("foodcategoryId", foodcategoryId);
    formData.append("vatId", vatId);
    formData.append("salesprice", salesprice);
    formData.append("description", description);
    formData.append("vegitem", vegitem);
    formData.append("beverage", beverage);
    formData.append("bar", bar);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .put(
        `${apiConfig.baseURL}/api/foodmenu/updatefoodmenu/${id}`,
        formData,
        config
      )

      .then((res) => {
        console.log(res);
        navigate("/viewfoodmenu");
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedValues(selectedOptions);
  };
  return (
    <div className="container-scroller">
      <Header />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Food Menu List</h4>
                  <div className="d-flex justify-content-end"></div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label
                        htmlFor="exampleInputUsername2"
                        className="col-sm-3 col-form-label"
                      >
                        Food Menu Name
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          value={foodmenuname}
                          onChange={(event) =>
                            setFoodmenuName(event.target.value)
                          }
                          name="foodmenuname"
                          id="exampleInputUsername2"
                          placeholder="Food Menu"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="exampleInputUsername2"
                        className="col-sm-3 col-form-label"
                      >
                        Food Category
                      </label>
                      <div className="col-sm-9">
                        <select
                          name="foodcategoryId"
                          className="form-control"
                          onChange={handleCategoryChange}
                          value={foodcategoryId}
                        >
                          <option>Select Food Category</option>
                          {foodCategory.map((food) => (
                            <option key={food._id} value={food._id}>
                              {food.foodcategoryname}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="exampleInputUsername2"
                        className="col-sm-3 col-form-label"
                      >
                        Food ingredient
                      </label>
                      <div className="col-sm-9">
                        <Select
                          options={units}
                          isMulti={true} // Enable multi-select
                          value={selectedValues}
        onChange={handleSelectChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="exampleInputUsername2"
                        className="col-sm-3 col-form-label"
                      >
                        Sales Price
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          value={salesprice}
                          onChange={(e) => {
                            setSalesPrice(e.target.value);
                          }}
                          name="salesprice"
                          id="exampleInputUsername2"
                          placeholder="Sales Price"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="exampleInputUsername2"
                        className="col-sm-3 col-form-label"
                      >
                        Vat
                      </label>
                      <div className="col-sm-9">
                        <select
                          name="vatId"
                          className="form-control"
                          onChange={handleVatChange}
                          value={vatId}
                        >
                          <option>Select Vat</option>
                          {vat.map((vat) => (
                            <option key={vat._id} value={vat._id}>
                              {vat.percentage}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="exampleInputUsername2"
                        className="col-sm-3 col-form-label"
                      >
                        Description
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                          }}
                          name="foodmenuname"
                          id="exampleInputUsername2"
                          placeholder="Description"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="exampleInputUsername2"
                        className="col-sm-3 col-form-label"
                      >
                        Is it Veg Item ?
                      </label>
                      <div className="col-sm-9">
                        <select
                          name="vegitem"
                          className="form-control"
                          onChange={handleVeg}
                          value={vegitem}
                        >
                          {vegs.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="exampleInputUsername2"
                        className="col-sm-3 col-form-label"
                      >
                        Is it Beverage ?
                      </label>
                      <div className="col-sm-9">
                        <select
                          name="beverage"
                          className="form-control"
                          onChange={handleBeverage}
                          value={beverage}
                        >
                          {Beverages.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="exampleInputUsername2"
                        className="col-sm-3 col-form-label"
                      >
                        Is it Bar Item ? *
                      </label>
                      <div className="col-sm-9">
                        <select
                          name="bar"
                          className="form-control"
                          onChange={handleBar}
                          value={bar}
                        >
                          {bars.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="exampleInputUsername2"
                        className="col-sm-3 col-form-label"
                      >
                        Photo
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="file"
                          className="form-control"
                          name="photo"
                          id="exampleInputUsername2"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-gradient-primary me-2"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default EditFoodMenu;
