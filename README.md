# React Native Journaling App (DailyDiary)

This is a React Native journaling application built with Expo. The app allows users to create, read, update, and delete journal entries, as well as view a summary of their entries.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)


## Features

- User authentication (login and registration)
- Create, read, update, and delete journal entries
- View a summary of journal entries
- Secure password hashing with SHA-256
- Smooth development and testing with Expo Go

## Installation

### Prerequisites

- **Node.js** (version 14 or later)
- **npm** (version 6 or later)
- **Expo CLI** (Install it globally using `npm install -g expo-cli`)
- **Expo Go App** (Available on [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) for Android or the [App Store](https://apps.apple.com/us/app/expo-go/id982107779) for iOS)

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Absalom16/journaling-app-mobile
    cd journaling-app-mobile
    ```

2. **Install the dependencies:**

    ```bash
    npm install
    ```

3. **Set up the backend service:**

    Follow the instructions in the [backend README](https://github.com/Absalom16/journaling-app---backend) to set up your Node.js backend service.

4. **Configure the environment variables:**

    Create a `.env` file in the root directory of the project and add the following variables:

    ```plaintext
    API_URL=your_api_URL eg http://192.168.100.123:3000/api
    ```
    Note: use your computer's IP address instead of localhost eg 192.168.100.123
    To get your IP address, run the following command "ipconfig" and select the "IPv4 Address".

    Replace `http://192.168.100.123:3000` with the URL of your backend service.

## Usage

### Running the App

To start the app, use the following command:

```bash
npm start
```

This will open Expo CLI terminal. You can also run the app using the Expo Go app on your mobile device:

1. Open the Expo Go app on your mobile device.
2. Scan the QR code displayed in the Expo CLI terminal.
3. Make sure that your computer and mobile device are connected to the same network.

### Running on a Simulator or Emulator

If you prefer to run the app on an Android emulator or iOS simulator:

- **For Android:** Ensure that you have [Android Studio](https://developer.android.com/studio) installed and an Android Virtual Device (AVD) set up.
- **For iOS:** Ensure that you have [Xcode](https://developer.apple.com/xcode/) installed and an iOS simulator set up.

In the Expo CLI, you can choose to run the app on an emulator by pressing `a` for Android or `i` for iOS.

