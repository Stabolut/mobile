import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, ENUMS } from '../../common';
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
    const { item } = this.props;
    //console.log("Item", item.transactionHash)

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ detailData: item }, () => {
            this.setState({ showDetailModal: true })

          })



        }} style={styles.mainView}>

        <View style={{ flex: 1 }}>

          <View style={{ flexDirection: "row" }}>

            <View style={styles.sendReceiveBtnView}>
              <Text style={styles.sendReceiveBtnText}>{item.receiverAddress !== this.props.userAddress ? "Sent" : "Received"}</Text>
            </View>
            {/* Circle With Center Icon */}
            {
              item.transactionStatus === 'Success' ?
                <View style={[styles.statusCircleView, { backgroundColor: "#3ada77", }]}>
                  <Ionicons name="md-checkmark-sharp" size={25} color={COLORS.BLACK} />
                </View>
                :
                item.transactionStatus === 'Fail' ?
                  <View style={[styles.statusCircleView, { backgroundColor: "red" }]}>
                    <Entypo name="cross" size={25} color={COLORS.BLACK}></Entypo>
                  </View> :

                  item.transactionStatus === 'Pending' ?
                    <View style={[styles.statusCircleView, { backgroundColor: "gray" }]}>
                      <Entypo name="dots-three-horizontal" size={15} color={COLORS.WHITE}></Entypo>
                    </View> : null




            }
            {/* Circle With Center Icon */}




          </View>
          {

          }
          <Text style={styles.transactionStatusText}>
            {item.transactionStatus === 'Success' ? 'Confirmed' : item.transactionStatus === 'Fail' ? "Fail" : item.transactionStatus === 'Pending' ? "Pending" : null}
          </Text>






          <Text style={styles.fromToText}>

            {item.receiverAddress === this.props.userAddress
              ? `From:${item.senderAddress}`
              : `To:${item.receiverAddress}`}

          </Text>


          {/* <Text style={styles.fromToText}>To: {`${item.receiverAddress.substring(0, 25)}...`}</Text> */}



        </View>

        <View>

          <View style={styles.sendAmountAndTimeMainView}>
            <Text style={styles.amountText}>${item.amountToSend.toLocaleString()}     US₿</Text>


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
            color: "#4f4e6e", alignSelf: "flex-end", marginTop: 16, fontSize: 14, fontFamily: "Poppins"

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
    marginBottom: 24
  },
  sendReceiveBtnView: {
    backgroundColor: "#4d6ce0",
    borderRadius: 15,
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    color: COLORS.WHITE
  },
  sendReceiveBtnText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontFamily: "Poppins"

  },
  statusCircleView: {

    width: 30,
    height: 30,
    marginLeft: 8,
    borderRadius: 30 / 2,
    justifyContent: "center",
    alignItems: "center"
  },
  transactionStatusText: {
    marginTop: 16,
    color: "#cdced9",
    marginBottom: 16,
    fontSize: 14,
    fontFamily: "Poppins"
  },
  fromToText: {
    color: "#c9c9e6",
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
    color: COLORS.WHITE,
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "bold",
    marginTop: 2,
  }
});

export default Transaction;
