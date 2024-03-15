const Str = {
  headerTitle: "Y",
  //contractAddress:"0x04790704ae59daDDF5258a0B52bC1dfd5Be85f0E",
  contractAddress: "0xb9193C22E895eA3ef46f67Cb1633B66C6e718aFe",
  // rpcUrl: "https://rpc.ankr.com/polygon_mumbai/",

  rpcUrl: "https://silent-hardworking-fog.arbitrum-goerli.discover.quiknode.pro/644204ee97ff9e5f0a6fc1e136c3fca78ed13159/",
  fees: 10,
  apiUrl: "https://ares.stabolut.com",
  //apiUrl: "http://192.168.100.6:8003",
  FUNDING_ADDRESS: "0x6983cB83052588AF94Cf9a937e664698e4E63490",


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