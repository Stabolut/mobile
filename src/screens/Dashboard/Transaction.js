import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, ENUMS, THEME } from '../../common';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import TransactionDetail from '../../components/Modal/TransactionDetail';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';


class Transaction extends React.Component {
  state = {
    showWebView: false,
    showDetailModal: false,
    detailData: {}
  };

  render() {
    const { item, selectedTheme } = this.props;
    const theme = THEME[selectedTheme];

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ detailData: item }, () => {
            this.setState({ showDetailModal: true })

          })



        }} style={styles.mainView}>

        <View style={{ flex: 1 }}>

          <View style={{ flexDirection: "row" }}>

            <View style={[styles.sendReceiveBtnView, { width: item.transactionType === "Staking" ? 150 : 100 }]}>
              <Text style={[styles.sendReceiveBtnText, { color: COLORS.WHITE, }]}>{item.transactionType === "Staking" ? "Staking Withdrawal" : item.receiverAddress !== this.props.userAddress ? "Sent" : "Received"}</Text>
            </View>
            {/* Circle With Center Icon */}
            {
              item.transactionStatus === 'Success' ?
                <View style={[styles.statusCircleView, { backgroundColor: "#3ada77", }]}>
                  <Ionicons name="checkmark" size={25} color={THEME?.commonColor.commonWhite} />
                </View>
                :
                item.transactionStatus === 'Fail' ?
                  <View style={[styles.statusCircleView, { backgroundColor: "red" }]}>
                    <Entypo name="cross" size={25} color={THEME?.commonColor.commonWhite}></Entypo>
                  </View> :

                  item.transactionStatus === 'Pending' ?
                    <View style={[styles.statusCircleView, { backgroundColor: "gray" }]}>
                      <Entypo name="dots-three-horizontal" size={15} color={THEME?.commonColor.commonWhite}></Entypo>
                    </View> : null
            }
            {/* Circle With Center Icon */}
          </View>
          {

          }
          <Text style={[styles.transactionStatusText, { color: theme?.TRANSACTION_STATUS_TEXT }]}>
            {item.transactionStatus === 'Success' ? 'Confirmed' : item.transactionStatus === 'Fail' ? "Fail" : item.transactionStatus === 'Pending' ? "Pending" : null}
          </Text>

          <Text style={[styles.fromToText, { color: theme?.ADDRESS_TEXT }]}>

            {item.transactionType === "Staking" ? `Transaction ID: ${item.transactionHash.substring(0, 10)}...${item.transactionHash.substring(item.transactionHash.length - 10)}` : item.transactionType === "Free Mint" ? `Free token from Stabolut: ${item.senderAddress}`  : item.receiverAddress === this.props.userAddress
              ? `From: ${item.senderAddress}`
              : `To: ${item.receiverAddress}`}

          </Text>


          {/* <Text style={styles.fromToText}>To: {`${item.receiverAddress.substring(0, 25)}...`}</Text> */}



        </View>

        <View>

          <View style={styles.sendAmountAndTimeMainView}>
            <Text style={[styles.amountText, { color: theme?.AMOUNT_COLOR }]}>${item.amountToSend.toLocaleString()} US₿</Text>


            {item.receiverAddress === this.props.userAddress ?
              <FeatherIcon
                name="arrow-down-left"
                size={25}
                style={{ marginLeft: 8 }}
                color="#52d970"></FeatherIcon> :
              item.senderAddress === this.props.userAddress ?
                <FeatherIcon
                  name="arrow-up-right"
                  size={25}
                  style={{ marginLeft: 8 }}
                  color="#e24e43"></FeatherIcon> : item.transactionStatus === 'Pending' ?
                  <Entypo
                    name="dots-three-horizontal"
                    size={20}
                    style={{ marginLeft: 8 }}
                    color="#77838f"></Entypo> :
                  <FeatherIcon
                    name="arrow-up-right"
                    size={25}
                    style={{ marginLeft: 8 }}
                    color="#e24e43"></FeatherIcon>


            }
          </View>
          <Text style={{
            color: theme?.TIMESTAMP_COLOR, alignSelf: "flex-end", marginTop: 16, fontSize: 14, fontFamily: "Poppins"

          }}>{moment(item.sendDate).fromNow()}</Text>
        </View>




        <TransactionDetail onClose={() => {

          this.setState({ showDetailModal: false })
        }}

          onBlochainContinue={(hash) => {

            this.setState({ showDetailModal: false })
            this.props.navigation.navigate(ENUMS.SCREENS.TRANSACTION_DETAIL, {
              transactionHash: hash,
            });
          }}

          theme={theme}

          userAddress={this.props.userAddress}
          showDetailModal={this.state.showDetailModal}
          item={this.state.detailData}


        ></TransactionDetail>


      </TouchableOpacity>



    );
  }
}
const styles = StyleSheet.create({


  mainView: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 24,
    marginBottom: 24,

  },
  sendReceiveBtnView: {
    backgroundColor: "#4d6ce0",
    borderRadius: 15,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    color: COLORS.WHITE
  },
  sendReceiveBtnText: {

    fontSize: 14,
    fontFamily: "Poppins"

  },
  statusCircleView: {

    width: 30,
    height: 30,

    borderRadius: 30 / 2,
    justifyContent: "center",
    alignItems: "center"
  },
  transactionStatusText: {
    marginTop: 16,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: "Poppins"
  },
  fromToText: {

    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Poppins",
  },
  sendAmountAndTimeMainView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 30
  },
  amountText: {

    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "bold",
    marginTop: 2,
  }
});

export default Transaction;
