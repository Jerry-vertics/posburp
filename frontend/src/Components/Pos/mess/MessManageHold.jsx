import React, { useState } from 'react'

export const MessManageHold = () => {
  const [showHoldModal, setShowHoldModal] = useState(false)
  const [showRenewModal, setShowRenewModal] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')

  // Sample packages data
  const messPackages = [
    { id: 1, name: 'Monthly (3 Meals/Day)' },
    { id: 2, name: 'Monthly (2 Meals/Day)' },
    { id: 3, name: 'Weekly (Lunch Only)' },
  ]

  const handleHoldSubscription = (subscriptionId) => {
    setSelectedSubscription(subscriptionId)
    setShowHoldModal(true)
    // Reset form fields
    setStartDate('')
    setReturnDate('')
  }

  const handleRenewSubscription = (subscriptionId) => {
    setSelectedSubscription(subscriptionId)
    setShowRenewModal(true)
    // Reset form fields
    setStartDate('')
    setSelectedPackage('')
  }

  const handleResumeSubscription = (subscriptionId) => {
    setSelectedSubscription(subscriptionId)
    setShowResumeModal(true)
    // Reset form fields
    setStartDate('')
  }

  const handleHoldSubmit = () => {
    // Handle hold subscription logic here
    console.log('Hold Subscription:', {
      subscriptionId: selectedSubscription,
      startDate,
      returnDate
    })
    // Close modal and reset
    setShowHoldModal(false)
    setSelectedSubscription(null)
    setStartDate('')
    setReturnDate('')
  }

  const handleRenewSubmit = () => {
    // Handle renew subscription logic here
    console.log('Renew Subscription:', {
      subscriptionId: selectedSubscription,
      startDate,
      package: selectedPackage
    })
    // Close modal and reset
    setShowRenewModal(false)
    setSelectedSubscription(null)
    setStartDate('')
    setSelectedPackage('')
  }

  const handleResumeSubmit = () => {
    // Handle resume subscription logic here
    console.log('Resume Subscription:', {
      subscriptionId: selectedSubscription,
      startDate
    })
    // Close modal and reset
    setShowResumeModal(false)
    setSelectedSubscription(null)
    setStartDate('')
  }

  const closeModal = () => {
    setShowHoldModal(false)
    setShowRenewModal(false)
    setShowResumeModal(false)
    setSelectedSubscription(null)
    setStartDate('')
    setReturnDate('')
    setSelectedPackage('')
  }

  return (
    <>
      <div className="card p-4">
        <h4>Manage Active Subscriptions</h4>
        <div className="table-responsive mt-3">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#8801</td>
                <td>Ahmed Abdullah</td>
                <td>42 Meals</td>
                <td><span className="badge bg-success">Active</span></td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => handleHoldSubscription('#8801')}
                  >
                    Hold
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleRenewSubscription('#8801')}
                  >
                    Renew
                  </button>
                </td>
              </tr>
              <tr>
                <td>#8805</td>
                <td>John Doe</td>
                <td>10 Meals</td>
                <td><span className="badge bg-danger">On Hold</span></td>
                <td>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleResumeSubscription('#8805')}
                  >
                    Resume
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Hold Subscription Modal */}
      {showHoldModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hold Subscription</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Subscription ID</label>
                    <input type="text" className="form-control" value={selectedSubscription} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Return Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={startDate}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleHoldSubmit}
                  disabled={!startDate || !returnDate}
                >
                  Submit Hold
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Renew Subscription Modal */}
      {showRenewModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Renew Subscription</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Subscription ID</label>
                    <input type="text" className="form-control" value={selectedSubscription} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Select Package</label>
                    <select
                      className="form-select"
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      required
                    >
                      <option value="">Choose a package...</option>
                      {messPackages.map(pkg => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRenewSubmit}
                  disabled={!startDate || !selectedPackage}
                >
                  Submit Renewal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Subscription Modal */}
      {showResumeModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Resume Subscription</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Subscription ID</label>
                    <input type="text" className="form-control" value={selectedSubscription} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Resume Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleResumeSubmit}
                  disabled={!startDate}
                >
                  Submit Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}