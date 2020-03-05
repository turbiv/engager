import React, { Component } from "react";
import PropTypes from "prop-types";
import uuid from "uuid";
import OrdersToolbar from "./OrdersToolbar";
import * as appActions from "./reducers/app.actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as orderactions from "./OrdersManagerActions";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  orderCard: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[50]
  },
  orderCardCompleted: {
    backgroundColor: theme.palette.grey[300]
  },
  gridEntry: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1
  },
  code: {
    width: 100
  },

  itemName: {
    width: 350
  },
  amount: {
    width: 100
  },
  hrLine: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    border: "1px solid",
    width: "100%"
  },
  orderTotal: {
    marginLeft: "auto"
  },
  completeButton: {
    marginLeft: "auto",
    marginRight: "auto"
  }
});

const OrderItem = props => {
  const { classes, order } = props;

  const purchases = order.purchases.map(purchase => {
    return (
      <div key={uuid.v4()} className={classes.gridEntry}>
        <div className={classes.itemName}>
          <Typography variant="h6">{purchase.name}</Typography>
          <Typography>€ {purchase.priceDisplay}</Typography>
        </div>
        <div className={classes.amount}>
          <Typography variant="h6">{purchase.amount}, kpl</Typography>
        </div>
        <div>
          <Typography variant="h6">€ {purchase.totalDisplay}</Typography>
        </div>
      </div>
    );
  });

  purchases.push(
    <div key={uuid.v4()} className={classes.gridEntry}>
      <div className={classes.hrLine} />
    </div>
  );

  if (order.haveBonus) {
    purchases.push(
      <div key={uuid.v4()} className={classes.gridEntry}>
        <div>
          <Typography variant="subtitle1">Subtotal:</Typography>
        </div>
        <div className={classes.orderTotal}>
          <Typography variant="subtitle1">€ {order.subtotalDisplay}</Typography>
        </div>
      </div>
    );
    purchases.push(
      <div key={uuid.v4()} className={classes.gridEntry}>
        <div>
          <Typography variant="subtitle1">Bonus:</Typography>
        </div>
        <div className={classes.orderTotal}>
          <Typography variant="subtitle1">
            &mdash; € {order.bonusDisplay}
          </Typography>
        </div>
      </div>
    );
  }

  purchases.push(
    <div key={uuid.v4()} className={classes.gridEntry}>
      <div>
        <Typography variant="h6">Total:</Typography>
      </div>
      <div className={classes.orderTotal}>
        <Typography variant="h6">€ {order.totalDisplay}</Typography>
      </div>
    </div>
  );

  return (
    <div className={classes.gridEntry}>
      <div className={classes.code}>
        <Typography variant="h6">{order.user_code}</Typography>
      </div>
      <div>{purchases}</div>
      <div className={classes.completeButton}>
        {order.orderStatus === orderactions.ORDER_STARTED ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => orderactions.completeOrder(order.orderKey)}
          >
            Complete
          </Button>
        ) : (
          <Typography variant="h6">This order is completed</Typography>
        )}
      </div>
    </div>
  );
};

const isTestOrder = () => {
  return window.location.search.includes("test=1");
};

class OrdersManager extends Component {
  componentDidMount() {
    this.reload();
  }

  reload = () => {
    const { orderData } = this.props;
    if (!orderData.isFetching) orderactions.queryOrders(isTestOrder());
  };

  render() {
    const { orderData, classes } = this.props;

    let listOrders;
    if (!orderData.isFetching) {
      if (orderData.orders.length > 0) {
        listOrders = orderData.orders.map(order => {
          const cardClass =
            order.orderStatus === orderactions.ORDER_STARTED
              ? `${classes.orderCard}`
              : `${classes.orderCard} ${classes.orderCardCompleted} `;

          return (
            <Card key={uuid.v4()} className={cardClass}>
              <CardContent>
                <OrderItem order={order} classes={classes} />
              </CardContent>
            </Card>
          );
        });
      } else
        listOrders = (
          <Card key={uuid.v4()} className={classes.orderCard}>
            <CardContent>
              <Typography variant="h6">No orders made</Typography>
            </CardContent>
          </Card>
        );
    }

    return (
      <div>
        <OrdersToolbar onRefresh={this.reload} />
        {listOrders}
      </div>
    );
  }
}

OrdersManager.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    clientData: state.clientData,
    orderData: state.orderData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(OrdersManager));
