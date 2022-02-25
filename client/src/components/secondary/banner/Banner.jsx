import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getMovies } from "../../../redux/actions"
import "./banner.css";

function Banner() {

    // We need to get all movies from the redux store when the component is mounted
    const dispatch = useDispatch();
    const movies = useSelector(state => state.movies);
    const [randomMovie, setRandomMovie] = useState(null);

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    useEffect(() => {
        if (movies.length > 0) {
            setRandomMovie(movies[Math.floor(Math.random() * movies.length)]);
        }
    }, [movies]);

    const truncate = (string, n) => {
        return string?.length > n ? string.substr(0, n - 1) + '...' : string;
    }
    return (
        <header className="banner__container" style={{
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundImage: `url(${randomMovie ? randomMovie.medium_cover_image : ""})`
        }}>
            <div className="benner_content">
                <h1 className="banner__title">
                    {randomMovie ? randomMovie.title : ""}
                </h1>
                <div className="banner_buttons">
                    <button className='banner__button'>Play</button>
                    <button className='banner__button'>My List</button>
                </div>
                <h1 className="banner__description">
                    {truncate(`${randomMovie ? randomMovie.synopsis : ""}`, 150)}
                </h1>
            </div>

            <div className="banner__fadeBottom" />
        </header>
    )
}

export default Banner