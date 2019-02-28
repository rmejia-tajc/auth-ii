import React from 'react';
import axios from 'axios';

import requiresAuth from '../auth/requiresAuth';



class Users extends React.Component {
    state = {
        users: [],
    };

    componentDidMount() {
        axios.get('/users').then(res => {
            this.setState({ users: res.data });
        });
    };

    render() {
        return (
            <>
                <h2>List of Users</h2>
                <div>
                    {this.state.users.map(user => (
                        <div key= {user.id}>
                            {user.username}
                        </div>
                    ))}
                </div>
            </>
        );
    };
};


export default requiresAuth(Users);