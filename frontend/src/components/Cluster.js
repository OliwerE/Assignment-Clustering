import React from 'react'

const Cluster = ({ data, clusterNum }) => {
  return (
    <>
      <ul className='main-ul'>
        <li>{`Cluster ${clusterNum + 1} (${data.length})`}</li>
        <ul>
          {data.map((blog, i) => {
            return <li>{blog}</li>
          })}
        </ul>
    </ul>
    </>
  )
}

export default Cluster