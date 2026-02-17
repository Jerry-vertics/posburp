import React, { useState, useEffect } from 'react'

export const MessDailyPunching = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  // Mock customer data
  useEffect(() => {
    setCustomers([
      {
        id: 'CUST001',
        name: 'John Doe',
        mobile: '050496523',
        status: 'Active',
        plan: 'Monthly Premium',
        remainingMeals: 45,
        meals: {
          breakfast: { done: false, time: '7:00 AM - 12:00 PM', disabled: false },
          lunch: { done: false, time: '12:00 PM - 5:00 PM', disabled: false },
          dinner: { done: false, time: '7:00 PM - 10:00 PM', disabled: false }
        }
      },
      {
        id: 'CUST002',
        name: 'Arun',
        mobile: '050496524',
        status: 'Active',
        plan: 'Weekly Basic',
        remainingMeals: 12,
        meals: {
          breakfast: { done: false, time: '7:00 AM - 12:00 PM', disabled: false },
          lunch: { done: false, time: '12:00 PM - 5:00 PM', disabled: false },
          dinner: { done: false, time: '7:00 PM - 10:00 PM', disabled: false }
        }
      },
      {
        id: 'CUST003',
        name: 'Aravind',
        mobile: '050496529',
        status: 'Active',
        plan: 'Daily Pass',
        remainingMeals: 3,
        meals: {
          breakfast: { done: false, time: '7:00 AM - 12:00 PM', disabled: false },
          lunch: { done: false, time: '12:00 PM - 5:00 PM', disabled: false },
          dinner: { done: false, time: '7:00 PM - 10:00 PM', disabled: false }
        }
      },
      {
        id: 'CUST004',
        name: 'Saiju',
        mobile: '050496543',
        status: 'Inactive',
        plan: 'Monthly Basic',
        remainingMeals: 0,
        meals: {
          breakfast: { done: false, time: '7:00 AM - 12:00 PM', disabled: true },
          lunch: { done: false, time: '12:00 PM - 5:00 PM', disabled: true },
          dinner: { done: false, time: '7:00 PM - 10:00 PM', disabled: true }
        }
      }
    ]);
  }, []);

  // Check meal timings and update disabled status
  useEffect(() => {
    if (!selectedCustomer) return;

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    setSelectedCustomer(prev => {
      if (!prev) return prev;

      const updatedMeals = { ...prev.meals };

      // Breakfast: 7:00 AM - 12:00 PM (noon)
      const breakfastStart = 7 * 60; // 7:00 AM
      const breakfastEnd = 12 * 60; // 12:00 PM (noon)
      updatedMeals.breakfast.disabled = !(
        currentTimeInMinutes >= breakfastStart &&
        currentTimeInMinutes < breakfastEnd
      ) || prev.remainingMeals <= 0 || prev.status === 'Inactive';

      // Lunch: 12:00 PM - 5:00 PM
      const lunchStart = 12 * 60; // 12:00 PM
      const lunchEnd = 17 * 60; // 5:00 PM
      updatedMeals.lunch.disabled = !(
        currentTimeInMinutes >= lunchStart &&
        currentTimeInMinutes < lunchEnd
      ) || prev.remainingMeals <= 0 || prev.status === 'Inactive';

      // Dinner: 7:00 PM - 10:00 PM
      const dinnerStart = 19 * 60; // 7:00 PM
      const dinnerEnd = 22 * 60; // 10:00 PM
      updatedMeals.dinner.disabled = !(
        currentTimeInMinutes >= dinnerStart &&
        currentTimeInMinutes < dinnerEnd
      ) || prev.remainingMeals <= 0 || prev.status === 'Inactive';

      return { ...prev, meals: updatedMeals };
    });
  }, [selectedCustomer]);

  // Filter customers based on search term
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        const filtered = customers.filter(customer =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.mobile.includes(searchTerm)
        )
        setFilteredCustomers(filtered)
        setShowDropdown(true)
      } else {
        setFilteredCustomers([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, customers])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    if (selectedCustomer) {
      setSelectedCustomer(null)
    }
  }

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    setSearchTerm(customer.name)
    setShowDropdown(false)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setSelectedCustomer(null)
    setShowDropdown(false)
  }

  const handleQRScan = () => {
    const activeCustomers = customers.filter(c => c.status === 'Active' && c.remainingMeals > 0)
    if (activeCustomers.length > 0) {
      const randomCustomer = activeCustomers[Math.floor(Math.random() * activeCustomers.length)]
      setSelectedCustomer(randomCustomer)
      setSearchTerm(randomCustomer.name)
    }
  }

  const handlePunchMeal = (mealType) => {
    if (selectedCustomer &&
        !selectedCustomer.meals[mealType].disabled &&
        !selectedCustomer.meals[mealType].done &&
        selectedCustomer.remainingMeals > 0) {

      setSelectedCustomer(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          remainingMeals: prev.remainingMeals - 1,
          meals: {
            ...prev.meals,
            [mealType]: {
              ...prev.meals[mealType],
              done: true,
              time: `Done at ${new Date().toLocaleTimeString()}`
            }
          }
        }
      })
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-md-5">
          <div className="card p-4">
            <h5 className="mb-3">
              <i className="bi bi-search me-2"></i>
              Scan or Search Customer
            </h5>

            {/* Search Input with Dropdown */}
            <div className="position-relative">
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="bi bi-person-badge"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type customer name, ID or mobile number..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
                  autoComplete="off"
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleClearSearch}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
                <button className="btn btn-success" onClick={handleQRScan}>
                  <i className="bi bi-qr-code-scan me-2"></i>
                  Scan QR
                </button>
              </div>

              {/* Customer Search Dropdown */}
              {showDropdown && (
                <div className="dropdown-menu show w-100 p-0" style={{ position: 'absolute', zIndex: 1000 }}>
                  {filteredCustomers.length > 0 ? (
                    <div className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {filteredCustomers.map(customer => (
                        <button
                          key={customer.id}
                          className="list-group-item list-group-item-action d-flex align-items-center p-3"
                          onClick={() => handleSelectCustomer(customer)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                               style={{ width: '40px', height: '40px', fontSize: '18px' }}>
                            {customer.name.charAt(0)}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">{customer.name}</h6>
                              <span className={`badge ${customer.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                                {customer.status}
                              </span>
                            </div>
                            <div className="d-flex small text-muted">
                              <span className="me-3">ID: {customer.id}</span>
                              <span className="me-3"> {customer.mobile}</span>
                              <span>🍽️ {customer.remainingMeals} meals</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted">
                      <i className="bi bi-emoji-frown fs-4 d-block mb-2"></i>
                      No customers found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-3">
              <div className="d-flex justify-content-between text-muted small">
                <span>📊 Active Customers: {customers.filter(c => c.status === 'Active').length}</span>
                <span>✅ Total Meals Today: 0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          {selectedCustomer ? (
            <div className="card p-4 bg-white">
              {/* Customer Header */}
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                     style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="mb-1">{selectedCustomer.name}</h3>
                      <div className="d-flex align-items-center gap-3">
                        <span className={`badge ${selectedCustomer.status === 'Active' ? 'bg-success' : 'bg-danger'} fs-6`}>
                          {selectedCustomer.status}
                        </span>
                        <span className="text-muted">
                          <i className="bi bi-qr-code me-1"></i>
                          {selectedCustomer.id}
                        </span>
                        <span className="text-muted">
                          <i className="bi bi-telephone me-1"></i>
                          {selectedCustomer.mobile}
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-secondary" onClick={handleClearSearch}>
                      <i className="bi bi-arrow-left"></i> Change
                    </button>
                  </div>
                </div>
              </div>

              {/* Plan & Remaining Meals */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="bg-light rounded p-3">
                    <small className="text-muted d-block">Current Plan</small>
                    <h5 className="mb-0">{selectedCustomer.plan}</h5>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={`rounded p-3 ${selectedCustomer.remainingMeals > 0 ? 'bg-info bg-opacity-10' : 'bg-warning bg-opacity-10'}`}>
                    <small className="text-muted d-block">Remaining Meals</small>
                    <h5 className={`mb-0 ${selectedCustomer.remainingMeals > 0 ? 'text-info' : 'text-warning'}`}>
                      {selectedCustomer.remainingMeals} Meals
                    </h5>
                  </div>
                </div>
              </div>

              {/* Meal Punching Buttons */}
              <h6 className="mb-3">Punch Your Meal</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <button
                    className={`btn w-100 p-3 ${
                      selectedCustomer.meals.breakfast.done
                        ? 'btn-success'
                        : !selectedCustomer.meals.breakfast.disabled
                          ? 'btn-warning'
                          : 'btn-light'
                    }`}
                    onClick={() => handlePunchMeal('breakfast')}
                    disabled={selectedCustomer.meals.breakfast.disabled || selectedCustomer.meals.breakfast.done || selectedCustomer.remainingMeals <= 0}
                  >
                    <i className="bi bi-sun fs-4 d-block mb-2"></i>
                    <strong>BREAKFAST</strong>
                    <small className="d-block mt-2">
                      {selectedCustomer.meals.breakfast.done
                        ? '✓ Completed'
                        : selectedCustomer.meals.breakfast.disabled
                          ? '7AM - 12PM'
                          : '7AM - 12PM'}
                    </small>
                    {selectedCustomer.meals.breakfast.done && (
                      <small className="d-block text-white-50">
                        {selectedCustomer.meals.breakfast.time}
                      </small>
                    )}
                  </button>
                </div>

                <div className="col-md-4">
                  <button
                    className={`btn w-100 p-3 ${
                      selectedCustomer.meals.lunch.done
                        ? 'btn-success'
                        : !selectedCustomer.meals.lunch.disabled
                          ? 'btn-primary'
                          : 'btn-light'
                    }`}
                    onClick={() => handlePunchMeal('lunch')}
                    disabled={selectedCustomer.meals.lunch.disabled || selectedCustomer.meals.lunch.done || selectedCustomer.remainingMeals <= 0}
                  >
                    <i className="bi bi-cloud-sun fs-4 d-block mb-2"></i>
                    <strong>LUNCH</strong>
                    <small className="d-block mt-2">
                      {selectedCustomer.meals.lunch.done
                        ? '✓ Completed'
                        : selectedCustomer.meals.lunch.disabled
                          ? '12PM - 5PM'
                          : '12PM - 5PM'}
                    </small>
                    {selectedCustomer.meals.lunch.done && (
                      <small className="d-block text-white-50">
                        {selectedCustomer.meals.lunch.time}
                      </small>
                    )}
                  </button>
                </div>

                <div className="col-md-4">
                  <button
                    className={`btn w-100 p-3 ${
                      selectedCustomer.meals.dinner.done
                        ? 'btn-success'
                        : !selectedCustomer.meals.dinner.disabled
                          ? 'btn-info'
                          : 'btn-light'
                    }`}
                    onClick={() => handlePunchMeal('dinner')}
                    disabled={selectedCustomer.meals.dinner.disabled || selectedCustomer.meals.dinner.done || selectedCustomer.remainingMeals <= 0}
                  >
                    <i className="bi bi-moon fs-4 d-block mb-2"></i>
                    <strong>DINNER</strong>
                    <small className="d-block mt-2">
                      {selectedCustomer.meals.dinner.done
                        ? '✓ Completed'
                        : selectedCustomer.meals.dinner.disabled
                          ? '7PM - 10PM'
                          : '7PM - 10PM'}
                    </small>
                    {selectedCustomer.meals.dinner.done && (
                      <small className="d-block text-white-50">
                        {selectedCustomer.meals.dinner.time}
                      </small>
                    )}
                  </button>
                </div>
              </div>

              {/* Today's Summary */}
              <div className="mt-4 pt-3 border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Today's Meal Status</span>
                  <span className="badge bg-secondary">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="d-flex gap-4 mt-2">
                  <div className="d-flex align-items-center">
                    <div className={`rounded-circle ${selectedCustomer.meals.breakfast.done ? 'bg-success' : 'bg-light'} p-2 me-2`}>
                      <i className={`bi bi-sun ${selectedCustomer.meals.breakfast.done ? 'text-white' : 'text-muted'}`}></i>
                    </div>
                    <small>Breakfast {selectedCustomer.meals.breakfast.done ? '✓' : '○'}</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className={`rounded-circle ${selectedCustomer.meals.lunch.done ? 'bg-success' : 'bg-light'} p-2 me-2`}>
                      <i className={`bi bi-cloud-sun ${selectedCustomer.meals.lunch.done ? 'text-white' : 'text-muted'}`}></i>
                    </div>
                    <small>Lunch {selectedCustomer.meals.lunch.done ? '✓' : '○'}</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className={`rounded-circle ${selectedCustomer.meals.dinner.done ? 'bg-success' : 'bg-light'} p-2 me-2`}>
                      <i className={`bi bi-moon ${selectedCustomer.meals.dinner.done ? 'text-white' : 'text-muted'}`}></i>
                    </div>
                    <small>Dinner {selectedCustomer.meals.dinner.done ? '✓' : '○'}</small>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-5 bg-light text-center h-100 d-flex align-items-center justify-content-center">
              <div>
                <i className="bi bi-person-bounding-box text-muted" style={{ fontSize: '64px' }}></i>
                <h4 className="mt-4 text-muted">No Customer Selected</h4>
                <p className="text-muted mb-4">Search for a customer or scan QR code to punch meals</p>
                <div className="d-flex gap-3 justify-content-center">
                  <div className="text-center">
                    <div className="bg-white rounded-circle p-3 d-inline-block mb-2">
                      <i className="bi bi-search fs-4 text-primary"></i>
                    </div>
                    <p className="small mb-0">Search by Name,<br />ID or Mobile</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-circle p-3 d-inline-block mb-2">
                      <i className="bi bi-qr-code-scan fs-4 text-success"></i>
                    </div>
                    <p className="small mb-0">Scan QR Code<br />for Quick Punch</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}