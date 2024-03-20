# USB Token Wallet Mobile App

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Why Choose USB Token Wallet Mobile App?](#why-choose-usb-token-wallet-mobile-app)
- [High-Level Process](#high-level-process)
- [Contact](#contact-us)

## Overview

The USB Token Wallet Mobile App provides a comprehensive solution for managing USB tokens on the go. With features like wallet creation, import, gasless transactions, transaction history, USB deposit, staking USB tokens, and more, users can easily manage their USB tokens securely and efficiently.

## Features

 
1. **Wallet Creation and Management**: Seamlessly create new USB token wallets or import existing ones with ease. Each wallet is securely stored locally on your device, ensuring complete control over your digital assets. Our intuitive interface simplifies wallet management, allowing users to organize and access their USB tokens effortlessly.

2. **Gasless Transactions**: Say goodbye to gas fees! Our app revolutionizes the transaction experience by enabling gasless transfers of USB tokens. Whether you're sending tokens to friends or making payments, enjoy swift and cost-effective transactions without worrying about additional fees.

3. **Transaction Tracking and History**: Stay informed about your USB token activity with our comprehensive transaction tracking and history feature. Monitor incoming and outgoing transactions, view transaction details, and track the status of each transaction in real-time. Our detailed transaction history provides valuable insights into your spending habits and financial activity.

4. **USB Deposit via QR Code**: Users are provided with a unique QR code containing their wallet address directly from the app. Simply share this QR code with others to allow them to transfer funds to your account effortlessly. This feature eliminates the need for manual input of wallet addresses and enhances the convenience of receiving USB tokens.

5. **Staking USB Tokens**: Unlock the potential of your USB tokens by staking them within the app. Our staking feature allows users to earn rewards by participating in network validation and consensus. Stake your USB tokens with confidence and watch your rewards grow over time, all while contributing to the security and stability of the network.

6. **Pin Authentication**: Secure your wallet with pin authentication to prevent unauthorized access and protect your digital assets. Users can set up a unique pin code to unlock their wallet, adding an extra layer of security to their USB token management experience.





## Technologies Used

 
- **React Native**: Framework for building the mobile application.
- **Realm**: Used for local storage of transaction records.
- **Web3 (Ether.js)**: Utilized for interacting with blockchain functions such as transferring USB tokens.
- **Firebase**: Integrated for real-time notifications.
- **Socket.io**: Utilized for live socket notifications.
- **QR Code Scanner**: Integrated for depositing USB tokens via QR code.
-  **Dependencies:** Make sure to have Node.js, npm,React Native CLI, Xcode (for iOS), and Android Studio (for Android) installed on your system to run the app locally.


### Additional Technology:

- **Redux**: Used for state management in the application.


## Installation

To run the app locally, follow these steps:

1.   Clone the repository:

         git clone https://github.com/Stabolut/mobile.git
     

3.   Navigate to the project directory:

         cd mobile

3.   Install dependencies:

         npm install
   
4.  For IOS

       - Navigate to the iOS directory:

              cd ios

      * Install CocoaPods dependencies:

             pod install
      
      * Return to the project directory:

             cd ..

6. Run the Android app:

        npx react-native run-android

7. Run the iOS app:

        npx react-native run-ios

   ### Why Choose USB Token Wallet Mobile App?


- **Security and Privacy**: Rest assured that your USB token wallets and transactions are protected by state-of-the-art security measures, including secure local storage and encryption.
- **Cost-Effective Transactions**: With gasless transactions, users can enjoy significant cost savings on transaction fees, making it more affordable and accessible to engage in cryptocurrency transactions.
- **Passive Income Opportunities**: Take advantage of our staking feature to earn passive income by staking your USB tokens. Participate in network consensus and receive rewards for your contribution.


## High-Level Process

1. **Wallet Creation and Management**:
   - Users can create new USB token wallets or import existing ones using the React Native framework.
   - Wallets are securely stored locally on the device using Realm, ensuring complete control over digital assets.
   - The application utilizes Web3 (Ether.js) to interact with blockchain functions such as transferring USB tokens.

2. **Transaction Handling**:
   - Users can initiate transactions, including gasless transfers of USB tokens, directly from the app.
   - Real-time transaction notifications are provided via Firebase integration.
   - Socket.io is used for live socket notifications to keep users updated on transaction status.

3. **Transaction Tracking and History**:
   - The app features comprehensive transaction tracking and history functionality, allowing users to monitor incoming and outgoing transactions.
   - Transaction details are stored locally using Realm for easy access and reference.

4. **QR Code Deposit**:
   - To receive USB tokens, users are provided with a unique QR code containing their wallet address directly from the app.
   - Sharing this QR code enables others to transfer funds to the user's account seamlessly.

5. **Staking USB Tokens**:
   - Users have the option to stake USB tokens within the app to earn rewards.
   - Staking functionality is implemented using Web3 (Ether.js), allowing users to participate in network validation and consensus.


## Contact Us

If you have any questions, suggestions, or feedback, feel free to reach out to us. We're here to help!

- Email: [press@stabolut.com](mailto:press@stabolut.com)





