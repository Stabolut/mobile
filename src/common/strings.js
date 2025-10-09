const Str = {
  fees: 0.1,

  apiUrl: "http://192.168.100.64:8003/api/v1/stabolut",
  socketUrl: "http://192.168.100.64:8003",
  // apiUrl: "https://ares.stabolut.com/api/v1/stabolut",
  // socketUrl: "https://ares.stabolut.com",
  TOKEN_DECIMAL: 1e2,

  ABI: [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",

    // Get the account balance
    "function balanceOf(address) view returns (uint)",

    "function countOf(address owner) view returns (uint256)",
    // Send some of your tokens to someone else
    "function transfer(address to, uint amount)",

    // An event triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)",

    "event TransferPreSigned(address indexed from, address indexed to, address indexed delegate, uint256 amount, uint256 fee)",

    "event ApprovalPreSigned(address indexed from, address indexed to, address indexed delegate, uint256 amount, uint256 fee)",


    "function getTransferPreSignedHash( address _token, address _to, uint256 _value, uint256 _fee, uint256 _nonce) public pure returns (bytes32)",

  ]

};




export default Str;