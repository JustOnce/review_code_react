import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Pagination from './TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as Action from "../../rdx/actions";


const styles = theme => ({
    root: {
        width: '70%',
        padding: '10px',
        main: 'auto',
        alignItems: 'center'
    },
    table: {
        minWidth: 400,
    },
    tableWrapper: {
        overflowX: 'auto',
        marginLeft: 30
    },
});

class EnhancedTable extends React.Component {
    state = {
        order: 'asc',
        orderBy: '',
        page: 0,
        rowsPerPage: 10,
    };


    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
        this.props.onSort(event, property);
    };


    handleChangePage = (event, page) => {
        this.setState({ page });
        const { users } = this.props;
        const { rowsPerPage } = this.state;
        this.setState({
            list: users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        })
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    render() {
        const { classes, users, label } = this.props;
        const { order, orderBy, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <EnhancedTableToolbar groupName={label}/>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                            rowCount={users.length}
                        />
                        <TableBody>
                            {users
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map(n => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={n.id}
                                        >
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.lastName}
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.group}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <Pagination
                    component="div"
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10, 25, 50, 300]}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }

}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        Action: bindActionCreators(Action, dispatch)
    }
}


export default connect(null, mapDispatchToProps)(withStyles(styles)(EnhancedTable));
