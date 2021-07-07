import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import * as Action from '../rdx/actions';
import BigTableButton from './UI/BigTableButton';
import EnhancedTable from './UI/EnhancedTable';
import FormDialog from "./UI/FormDialog";
import Progress from "./UI/Progress";


// так делается стабильна сортировка по возрастанию
// по убыванию поменять местами a и b
function desc(a, b, orderBy) {
    return a[orderBy] - b[orderBy];
}

// сортировка в js и так стабильная
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
    // todo: разбить на 2 функции сортировки, а не использовать одну desc
    return order === 'desc' ? (a, b) => desc(a, b) : (a, b) => -desc(a, b);
}

// todo: дать более понятные названия классов
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

// что значит MyList ?
// todo: дать более конкретное название, к примеру UserTables
// по зависимостям вижу что реакт 16+ версии, нужно было использовать функциональные компоненты
// todo: переписать на функциональный компонент
class MyList extends Component {
    state = {
        grouped: false
    };

    // todo: дать более понятное названии функции, к примеру setGroup
    handleClick = grouped => {
        this.setState({
            grouped: grouped
        })
    };

    componentWillMount() {
        this.props.Action.getList(1);  //
    };

    // todo: дать более понятное названии функции, к примеру setTableSort
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

        // todo: вынести группы в state
        // по идее они должны быть в пропсах и приходить с сервера
        const groups =  ['engineer', 'accountant', 'hr', 'manager', null];

        // todo: мемоизировать результат чтобы небыло группировки при каждом рендере
        if (this.state.grouped){
            // todo: переписать на reduce c объектом
            users.forEach(user => {
                if (!groupedUsers.hasOwnProperty(user.group)){
                    groupedUsers[user.group] = [];
                }

                groupedUsers[user.group].push(user);
            });
        }

        return (
            // todo: сделать форматирование кода
            // todo: разбить на несколько компонентов
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
        // todo: разбить на несколько просов, дав им понятное название
        reducer: state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // зачем bind всех экшенов ?
        // нужно мапить то что используется в компоненте
        // todo: разбить на несколько биндингов функций
        //       из названия функции должно быть понятно что она делает
        Action: bindActionCreators(Action, dispatch)
    }
}

// todo: никогда не использовать export default
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MyList))
