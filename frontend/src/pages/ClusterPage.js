import React, { useState } from 'react'
import Cluster from '../components/Cluster'
import Form from '../components/Form'

const ClusterPage = () => {
  const [clusters, setClusters] = useState([])

  return (
    <div>
      <h1>K-means clustering</h1>
      <Form updateClusters={setClusters} />
      {clusters.map((cluster, i) => {
        return <Cluster data={cluster} clusterNum={i} />
      })}
    </div>
  )
}

export default ClusterPage