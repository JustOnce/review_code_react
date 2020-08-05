import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import * as Action from '../rdx/actions';
import BigTableButton from './UI/BigTableButton';
import EnhancedTable from './UI/EnhancedTable';
import FormDialog from "./UI/FormDialog";
import Progress from "./UI/Progress";



function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}


function stableSort(array, cmp) {
    console.log(array);

    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}


function getSorting(order) {
    return order === 'desc' ? (a, b) => desc(a, b) : (a, b) => -desc(a, b);
}

const styles = () => ({
    root: {
        marginTop: 30,
        display: 'flex',
        justifyContent: 'space-between',
        flex: '1'
    },
    left: {
        // marginLeft: 20,
        width: '20%'
    },
    center: {
        width: '70%'
    },
    groupButton: {
        marginLeft: 410,
    }
});


class MyList extends Component {
    state = {
        grouped: false
    };

    handleClick = grouped => {
        this.setState({
            grouped: grouped
        })
    };

    componentWillMount() {
        this.props.Action.getList(1);  //
    };

    onSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
        const { users } = this.props.reducer;
        this.props.Action.saveList(stableSort(users, getSorting(order, orderBy)));
    };

    render() {
        const { classes } = this.props;
        const { users } = this.props.reducer;
        let groupedUsers = {};

        const groups =  ['engineer', 'accountant', 'hr', 'manager', null];

        if (this.state.grouped){
            users.forEach(user => {
                if (!groupedUsers.hasOwnProperty(user.group)){
                    groupedUsers[user.group] = [];
                }

                groupedUsers[user.group].push(user);
            });
        }

        return (
            <div className={classes.root}>
                <div className={classes.left}>
                    <BigTableButton handler={() => this.handleClick(false)}>Show All Users</BigTableButton>
                    <BigTableButton handler={() => this.handleClick(true)}>Group by group</BigTableButton>
                </div>
                <div className={classes.center}>
                    {
                        users.length ?
                            ( !this.state.grouped ?
                            <EnhancedTable onSort={this.onSort} users={users} label='allUsers'/> : groups.map(group => (
                              <EnhancedTable onSort={this.onSort} users={groupedUsers[group]} label={group}/>)
                            ))
                            :
                            <Progress />
                    }
                    <FormDialog className={classes.dialog} handler={this.props.Action.addUser}/>
                </div>
            </div>
        )
    }
}



function mapStateToProps(state) {
    return {
        reducer: state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        Action: bindActionCreators(Action, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MyList))
