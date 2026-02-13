import React, { useState } from 'react'

const MessCustomerSubscription = () => {
  const [customerType, setCustomerType] = useState('new')
  const [existingCustomers, setExistingCustomers] = useState([
    { id: 1, name: 'John Doe', mobile: '0501234567', flat: 'A-101', idCard: '123456789' },
    { id: 2, name: 'Jane Smith', mobile: '0509876543', flat: 'B-205', idCard: '987654321' },
  ])

  const [newSubscription, setNewSubscription] = useState({
    name: '',
    mobile: '',
    package: 'Monthly (3 Meals/Day)',
    startDate: '',
    expiryDate: '',
    totalAmount: '',
    paidAmount: '',
    flatNo: '',
    roomNo: '',
    buildingName: '',
    idCardType: 'emirates',
    idCardNumber: ''
  })

  const handleSubscriptionChange = (e) => {
    const { name, value } = e.target
    setNewSubscription(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCustomerTypeChange = (e) => {
    setCustomerType(e.target.value)
    // Reset form when switching
    setNewSubscription(prev => ({
      ...prev,
      name: '',
      mobile: '',
      flatNo: '',
      roomNo: '',
      buildingName: '',
      idCardNumber: ''
    }))
  }

  const handleExistingCustomerSelect = (e) => {
    const customerId = parseInt(e.target.value)
    const selectedCustomer = existingCustomers.find(c => c.id === customerId)
    if (selectedCustomer) {
      setNewSubscription(prev => ({
        ...prev,
        name: selectedCustomer.name,
        mobile: selectedCustomer.mobile,
        flatNo: selectedCustomer.flat,
        idCardNumber: selectedCustomer.idCard
      }))
    }
  }

  const handleActivateSubscription = () => {
    // Handle subscription activation
    console.log('Subscription activated:', newSubscription)
  }

  return (
    <div className="card p-4">
      <h4>Enroll New Customer</h4>

      {/* Customer Type Selection */}
      <div className="mb-4">
        <label className="form-label d-block">Customer Type</label>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="customerType"
            id="newCustomer"
            value="new"
            checked={customerType === 'new'}
            onChange={handleCustomerTypeChange}
          />
          <label className="form-check-label" htmlFor="newCustomer">
            New Customer
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="customerType"
            id="existingCustomer"
            value="existing"
            checked={customerType === 'existing'}
            onChange={handleCustomerTypeChange}
          />
          <label className="form-check-label" htmlFor="existingCustomer">
            Existing Customer
          </label>
        </div>
      </div>

      <form className="row g-3">
        {/* Existing Customer Dropdown */}
        {customerType === 'existing' && (
          <div className="col-12">
            <label className="form-label">Select Existing Customer</label>
            <select
              className="form-select"
              onChange={handleExistingCustomerSelect}
              defaultValue=""
            >
              <option value="" disabled>Choose customer...</option>
              {existingCustomers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.mobile} - Flat: {customer.flat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Customer Details - Only show for new or when existing customer selected */}
        {(customerType === 'new' || newSubscription.name) && (
          <>
            {/* Basic Info */}
            <div className="col-md-6">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                name="name"
                value={newSubscription.name}
                onChange={handleSubscriptionChange}
                readOnly={customerType === 'existing'}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="05x xxxxxxx"
                name="mobile"
                value={newSubscription.mobile}
                onChange={handleSubscriptionChange}
                readOnly={customerType === 'existing'}
              />
            </div>

            {/* Address Information */}
            <div className="col-md-4">
              <label className="form-label">Building/Flat Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Al Raha Tower"
                name="buildingName"
                value={newSubscription.buildingName}
                onChange={handleSubscriptionChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Flat/Room No</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., 1204"
                name="roomNo"
                value={newSubscription.roomNo}
                onChange={handleSubscriptionChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Additional Details</label>
              <input
                type="text"
                className="form-control"
                placeholder="Floor, etc."
                name="flatNo"
                value={newSubscription.flatNo}
                onChange={handleSubscriptionChange}
              />
            </div>

            {/* ID Card Information */}
            <div className="col-md-6">
              <label className="form-label">ID Card Type</label>
              <select
                className="form-select"
                name="idCardType"
                value={newSubscription.idCardType}
                onChange={handleSubscriptionChange}
              >
                <option value="emirates">Emirates ID</option>
                <option value="passport">Passport</option>
                <option value="national">National ID (Country ID)</option>
                <option value="driving">Driving License</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">ID Card Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter ID number"
                name="idCardNumber"
                value={newSubscription.idCardNumber}
                onChange={handleSubscriptionChange}
              />
            </div>
          </>
        )}

        {/* Subscription Details */}
        <div className="col-md-4">
          <label className="form-label">Select Package</label>
          <select
            className="form-select"
            name="package"
            value={newSubscription.package}
            onChange={handleSubscriptionChange}
          >
            <option>Monthly (3 Meals/Day)</option>
            <option>Monthly (2 Meals/Day)</option>
            <option>Weekly (Lunch Only)</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={newSubscription.startDate}
            onChange={handleSubscriptionChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Expiry Date (Auto)</label>
          <input
            type="text"
            className="form-control bg-light"
            name="expiryDate"
            value={newSubscription.expiryDate}
            readOnly
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Total Amount</label>
          <input
            type="text"
            className="form-control"
            name="totalAmount"
            value={newSubscription.totalAmount}
            readOnly
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Payment Received</label>
          <input
            type="text"
            className="form-control"
            placeholder="Amount Paid"
            name="paidAmount"
            value={newSubscription.paidAmount}
            onChange={handleSubscriptionChange}
          />
        </div>

        <div className="col-12 text-end mt-4">
          <button type="button" className="btn btn-secondary me-2">Cancel</button>
          <button
            type="button"
            className="btn btn-success px-5"
            onClick={handleActivateSubscription}
          >
            Activate & Print Card
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessCustomerSubscription