import React from "react";
import { useState, useEffect } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import Footer from "../layouts/Footer";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import apiConfig from "../layouts/base_url";

const ImportFoodmenu = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // Check by file extension (most reliable)
      const fileName = selectedFile.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (fileExtension !== 'csv') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select a CSV file (file must end with .csv)',
        });
        setFile(null);
        event.target.value = ''; // Reset file input
        return;
      }

      // Optional: Also check file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'File size must be less than 5MB',
        });
        setFile(null);
        event.target.value = '';
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a CSV file to import',
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("csvFile", file); // Make sure the field name matches backend

    try {
      const response = await axios.post(`${apiConfig.baseURL}/api/foodmenu/importfoodmenu`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout
      });

      const { importedCount, duplicateCount, message, importedFoodmenu, duplicateFoodmenu } = response.data;

      if (importedCount > 0) {
        let successMessage = `Successfully imported ${importedCount} food items.`;
        if (duplicateCount > 0) {
          successMessage += `\n${duplicateCount} duplicate items were skipped.`;
        }

        Swal.fire({
          icon: 'success',
          title: 'Import Completed!',
          text: successMessage,
          confirmButtonText: 'View Food Menu'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/viewfoodmenu');
          }
        });
      } else if (duplicateCount > 0 && importedCount === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No New Items Imported',
          text: `All ${duplicateCount} items already exist in the database.`,
          confirmButtonText: 'View Food Menu'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/viewfoodmenu');
          }
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No Changes Made',
          text: 'No valid food items were found in the file.',
        });
      }

    } catch (error) {
      console.error("Import error:", error);

      let errorMessage = 'Something went wrong during import!';
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Import Failed',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = async () => {
    try {
      const response = await axios.get("/downloadcsv/foodmenu.csv", {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample-foodmenu.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: 'Sample CSV file is being downloaded',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Download error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Unable to download sample file. Please try again.',
      });
    }
  };

  return (
    <div className="container-scroller">
      <Header />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title"> Import Foodmenu </h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Food</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Import Foodmenu
                  </li>
                </ol>
              </nav>
            </div>
            <div className="row">
              <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="form-group row">
                          <label
                            htmlFor="csvFile"
                            className="col-sm-3 col-form-label"
                          >
                            Import Foodmenu
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="file"
                              className="form-control"
                              name="csvFile"
                              id="csvFile"
                              accept=".csv, text/csv, application/vnd.ms-excel"
                              onChange={handleFileChange}
                              disabled={loading}
                            />
                            {file && (
                              <small className="form-text text-muted">
                                Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                              </small>
                            )}
                            <small className="form-text text-muted">
                              Please upload a CSV file with columns: foodmenuname, foodcategoryId, foodingredientId, salesprice, vatId, description, vegitem, beverage, bar, photo
                            </small>
                          </div>
                        </div>

                        <div className="col-sm-3"></div>
                        <div className="col-sm-9">
                          <button
                            type="button"
                            className="btn btn-gradient-info me-2"
                            onClick={handleDownloadSample}
                            disabled={loading}
                          >
                            Download Sample CSV
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <button
                          type="submit"
                          className="btn btn-gradient-primary me-2"
                          disabled={loading || !file}
                        >
                          {loading ? 'Importing...' : 'Submit'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => navigate('/viewfoodmenu')}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
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

export default ImportFoodmenu;