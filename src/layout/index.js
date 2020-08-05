import React, { Component } from 'react';


export default class Layout extends Component {
    render() {
        return (
            <div className='App'>
                <main className='Main'>
                    {this.props.children}
                </main>
            </div>

        )
    }
}