import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CuisineSection.css";
import indian from "../assets/indian.jpg";
import italian from "../assets/italian.jpg";
import russian from "../assets/russian.jpg";
import chinese from "../assets/chinese.jpeg";
import japanese from "../assets/japanese.jpeg";
import mexican from "../assets/mexican.jpeg";
import french from "../assets/french.jpeg";
import thai from "../assets/thai.jpeg";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import chefImg from "../assets/chef.png";
import Header from "./Header";

const allCuisines = [
  { name: "Indian", img: indian },
  { name: "Italian", img: italian },
  { name: "Russian", img: russian },
  { name: "Chinese", img: chinese },
  { name: "Japanese", img: japanese },
  { name: "Mexican", img: mexican },
  { name: "French", img: french },
  { name: "Thai", img: thai },
];

const CuisineSection = () => {
  const [startIndex, setStartIndex] = useState(0);
  const cuisinesPerPage = 3;
  const navigate = useNavigate();

  const nextCuisines = () => {
    if (startIndex + cuisinesPerPage < allCuisines.length) {
      setStartIndex(startIndex + cuisinesPerPage);
    }
  };

  const prevCuisines = () => {
    if (startIndex - cuisinesPerPage >= 0) {
      setStartIndex(startIndex - cuisinesPerPage);
    }
  };

  const handleCuisineClick = (cuisine) => {
    navigate(`/explore-recipes/${cuisine}`);
  };

  return (
    <div>
      <Header />
      <div className="hero-section">
        <div className="hero-content">
          <h1>
            Cook Like A Pro With Our <span className="highlight">Easy</span> And{" "}
            <span className="highlight">Tasty</span> Recipes
          </h1>
          <p>
            From Quick and Easy meals to gourmet delight, we have something for
            every taste and occasion.
          </p>
          <button className="explore-btn" onClick={() => navigate("/explore-recipes")}>
            Explore all Recipes
          </button>
        </div>
        <img src={chefImg} alt="Chef" className="chef-image" />
      </div>

      <div className="cuisine-explore-section">
        <h2>Explore By Cuisine Type</h2>
        <p>
          Discover new flavours and cooking techniques with our diverse selection
          of cuisine types.
        </p>
        <ul className="cuisine-list">
          {allCuisines.map((cuisine, index) => (
            <li key={index} onClick={() => handleCuisineClick(cuisine.name)}>
              {cuisine.name}
            </li>
          ))}
        </ul>

        <div className="scroll-container">
          {allCuisines.slice(startIndex, startIndex + cuisinesPerPage).map((cuisine, index) => (
            <div key={index} className="cuisine-card">
              <img src={cuisine.img} alt={`${cuisine.name} cuisine`} />
              <div className="cuisine-name-container">
                {index === 0 && (
                  <button
                    className="scroll-btn left"
                    onClick={prevCuisines}
                    disabled={startIndex === 0}
                    aria-label="Previous cuisines"
                  >
                    <FaArrowLeft />
                  </button>
                )}
                <div className="cuisine-name">{cuisine.name}</div>
                {index === cuisinesPerPage - 1 && (
                  <button
                    className="scroll-btn right"
                    onClick={nextCuisines}
                    disabled={startIndex + cuisinesPerPage >= allCuisines.length}
                    aria-label="Next cuisines"
                  >
                    <FaArrowRight />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CuisineSection;