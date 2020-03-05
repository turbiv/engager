const styles = theme => {
  console.log(theme);
  return {
    card: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(3)
    },
    tab: {
      height: 340,
      display: "flex",
      flexDirection: "column"
    },
    tabPromo: {
      marginTop: theme.spacing(1)
    },

    sellableActionsContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
    },
    sellableErrors: {
      display: "flex",
      width: "100%",
      flexDirection: "column"
    },

    centerContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    },
    fullCardRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%"
    },

    previewImageLineContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1
    },
    previewImageContainer: {
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    },
    textLine: {
      display: "flex",
      flexDirection: "row",
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    },

    promoImagePlaceholder: {
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      boxShadow: theme.shadows[1],
      borderRadius: theme.shape.borderRadius,
      border: "1px solid",
      margin: theme.spacing(1)
    },
    descriptionText: {
      position: "relative"
    },
    leftColumnLabel: {
      marginRight: theme.spacing(2),
      width: "40%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    rightColumnLabel: {
      display: "flex",
      alignItems: "center"
    },
    leftPrmotionScheduling: {
      flexBasis: "25%",
      marginLeft: theme.spacing(1),
      display: "flex",
      alignItems: "center"
    },
    rightPrmotionScheduling: {
      display: "flex",
      alignItems: "center"
    },
    promoMessageText: {
      width: 300
    },
    prmotionRow: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    priceEuro: {
      marginRight: theme.spacing(2)
    },
    tinyEditBox: {
      width: 90,
      height: 40
    },
    bonusTypeSelector: {
      minWidth: 130,
      marginRight: theme.spacing(1)
    },
    bonusCell: {
      width: "100%"
    },
    bonusRow: {
      height: 52
    },

    bonusTextLabel: {
      marginRight: theme.spacing(1),
      width: 90
    },
    bonusTextLabelLong: {
      width: 140
    },

    bonusSchedulerButton: {
      textTransform: "none"
    },
    bonusTab: {
      overflowY: "auto",
      paddingTop: theme.spacing(1)
    },
    bonusAddButtonRow: {
      flexGrow: 1
    },
    bonusAddButton: {
      marginTop: theme.spacing(1)
    }
  };
};

export default styles;
