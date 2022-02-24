import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getMovies } from "../../../redux/actions"
import Banner from '../../secondary/banner/Banner'
import Nav from '../../secondary/nav/Nav'
import "./home.css"

function Home() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getMovies())

  })

  return (
    <div className="home_container">

      {/* Nav */}
      <Nav />
      {/* Banner */}
      <Banner />
      {/* Row */}
    </div>
  )
}

export default Home