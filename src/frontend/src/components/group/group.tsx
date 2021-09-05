import React from 'react'
import { NavLink } from 'react-router-dom';
import PATHS from '../../path';


function Group() {
    return (
        <div>Hello world group
                        <p>
            <NavLink to={PATHS["admin"].url}><div className="adminHeader">Back to admin</div></NavLink>
            </p>
        </div>
      );
}

export default Group