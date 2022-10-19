import React from 'react';
import {format} from 'date-fns';

export default (props) => {
    return (
        <footer>
            <div class="py-1 text-center">&copy; {format(new Date(), 'Y')}. All rights reserved.</div>
        </footer>
    )
}