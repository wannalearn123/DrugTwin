import React from 'react'
import { Link } from 'react-router';

const BackButton = (props) => {
  const {title, location} = props;
  return (
    <div className="flex justify-between items-center gap-4">
        <h1 className="text text-xl font-bold">{title}</h1>
        <Link to={`/${location}`} className="btn btn-ghost">
        <span>Back</span>
        </Link>
    </div>
  )
}

export default BackButton