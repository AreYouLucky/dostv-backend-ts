import React from 'react'
import './loader.css'

const Loader: React.FC = () => {
  return (
    <div className="loader-wrapper">
      <svg
        className="pl1"
        viewBox="0 0 128 128"
        role="img"
        aria-label="Loading"
      >
        <g className="pl1__g">
          <g transform="translate(20 20)">
            <g className="pl1__rect-g">
              <rect className="pl1__rect" />
              <rect className="pl1__rect second" />
            </g>
            <g transform="rotate(180 44 44)" className="pl1__rect-g">
              <rect className="pl1__rect" />
              <rect className="pl1__rect second" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Loader
