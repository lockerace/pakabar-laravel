import React from 'react';
import {format} from 'date-fns';

export default (props) => {
    if (!props.error) return null;
    return (
        <section className="full-height d-flex flex-column">
          <div className="flex-fill container pt-5">
            <h1 className="display-1">ERROR</h1>
            <p>{props.error.statusText || props.error.message}</p>
          </div>
        </section>
    )
}
