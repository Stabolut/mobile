const Str = {
  headerTitle: "Y",
  //contractAddress:"0x04790704ae59daDDF5258a0B52bC1dfd5Be85f0E",
  contractAddress: "0x24c8479b8af9742c5160e0c29197e87a584cfe99",
  // rpcUrl: "https://rpc.ankr.com/polygon_mumbai/",

  rpcUrl: "https://boldest-snowy-putty.arbitrum-sepolia.quiknode.pro/1f392d02eb2231054a585bf86a27a4bd0c27a8d5/",
  fees: 10,
  //apiUrl: "https://ares.stabolut.com",
  apiUrl: "http://192.168.100.50:8003/api/v1/stabolut",
  socketUrl: "http://192.168.100.50:8003",
  FUNDING_ADDRESS: "0x23F6b853d75f34F0A16dc97E4A2827cE8aA9A7C7",


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