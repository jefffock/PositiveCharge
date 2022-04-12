import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PlacesAutocomplete from './PlacesAutocomplete.jsx'

function AddPOI () {
  const [pointName, setPointName] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [category, setCategory] = useState('food')
  const [price, setPrice] = useState('')
  const [showCostGuide, setShowCostGuide] = useState(false)
  const [noName, setNoName] = useState(false)
  const [noCoords, setNoCoords] = useState(false)
  const [noPrice, setNoPrice] = useState(false)
  const [canSubmit, setCanSubmit] = useState(true)

  function handleSubmit(e) {
    e.preventDefault()
    let data = {
      name: pointName,
      lat,
      lng,
      category,
      price
    }
    if (validatePoiInfo(data)) {
      axios.post('/addPOI', data)
      .then(response => {
        console.log('response in component', response)
      })
      .catch(err => {
        console.error(err)
      })
    }
  }

  function validatePoiInfo(data) {
    let isValid = true
    if (pointName === '') {
      isValid = false
      setNoName(true)
    } if (lat === '' || lng === '') {
      isValid = false
      setNoCoords(true)
    } if (price === '') {
      isValid = false
      setNoPrice(true)
    }
    return isValid
  }

  useEffect(() => {
    if (pointName !== '') {
      setNoName(false)
    } if (lat !== '' && lng !== '') {
      setNoCoords(false)
    } if (price !== '') {
      setNoPrice(false)
    } if (!noPrice && !noName && !noCoords) {
      setCanSubmit(true)
    } else {
      setCanSubmit(false)
    }
  }, [pointName, lat, lng, price, noPrice, noName, noCoords])

  return (
    <div className="add-poi-form-container">
      <div className="add-poi-form-wrapper">
        <h1>Add a Point of Interest</h1>
        <form onSubmit={(e) => handleSubmit(e)}>

        <label htmlFor="point-name-input">Name: </label><br />
        <input
          type="text"
          className="text-input"
          id="point-name-input"
          placeholder=""
          value={pointName}
          onChange={e =>
            setPointName(e.target.value)}
        >
          </input><br></br><br></br>

          <label htmlFor="point-name-input">Location: </label>
          <PlacesAutocomplete setLat={setLat} setLng={setLng}/>

          <br></br><br></br>

          <label htmlFor="category-select">Category: </label><br />
          <select id="category-select"
          value={category}
          onChange={e => setCategory(e.target.value)}>
            <option value="food">Food</option>
            <option value="cafe">Cafe</option>
            <option value="museum">Museum</option>
            <option value="landmark">Landmark or Historical</option>
            <option value="park">Park</option>
            <option value="other">Other</option>
          </select><br></br><br></br>

          <h3>Cost</h3>
          <input type="radio" className="radio-button price-input" name="price" id="free" value="free" onClick={e => setPrice(e.target.value)}></input>
          <label htmlFor="free">Free</label>

          <input type="radio" className="radio-button price-input" name="price" id="$" value="$" onClick={e => setPrice(e.target.value)}></input>
          <label htmlFor="$">$</label>

          <input type="radio" className="radio-button price-input" name="price" id="$$" value="$$" onClick={e => setPrice(e.target.value)}></input>
          <label htmlFor="$$">$$</label>

          <input type="radio" className="radio-button price-input" name="price" id="$$$" value="$$$" onClick={e => setPrice(e.target.value)}></input>
          <label htmlFor="$$$">$$$</label><br></br>

          {!showCostGuide &&
          <p onClick={() => setShowCostGuide(true)}>Show Cost Guidelines</p>}

          {showCostGuide &&
          <>
          <p>Cost Guidelines</p>
          <p>$: Low. For restaurants, the average meal costs less than $15</p>
          <p>$$: Medium. For restaurants, the average meal costs $15 - $30</p>
          <p>$$$: High. For restaurants, the average meal costs more than $30</p>
          </>}

          {/* Check if user is a business user, if so, show checkbox for "this is my business" */}

          <input type="submit" value="Add POI" disabled={!canSubmit}></input>
          <br/>
          {noName &&
          <p className="warning">Please add a name</p>}
          {noCoords &&
          <p className="warning">Please select a valid address</p>}
          {noPrice &&
          <p className="warning">Please select a price level</p>}
          <br />
        </form>
      </div>
    </div>
  )
}

export default AddPOI;