import React from 'react'

const Form = ({ getData, updateClusters }) => {

  const handleFormSubmit = (e) => {
    e.preventDefault()
    fetch(`http://localhost:8080/k-means?clusters=${e.target.clusters.value}&iterations=${e.target.iterations.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'No-Store'
      }
    }).then(res => {
      return res.json()
    }).then(json => {
      updateClusters(json.data)
    })
  } 

  return (
    <>
      <form id='cluster-form' onSubmit={handleFormSubmit}>
        <div style={{ float: 'left', marginLeft: '20px' }}>
          <label htmlFor="iterations">Iterations: </label>
          <input type="number" id="iterations" name="iterations" required/>
        </div>
        <div style={{ float: 'left', marginLeft: '20px' }}>
          <label htmlFor="clusters">Clusters: </label>
          <input type="number" id="clusters" name="clusters" required/>
        </div>
        <input id='submit' type='submit' value='Submit' />
      </form>
    </>
  )
}

export default Form