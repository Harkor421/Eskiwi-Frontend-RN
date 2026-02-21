import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';

import EmailVerificationScreen from "../screens/EmailVerificationScreen";
import LoginScreen from "../screens/LoginScreen";
import RecoverPassword from "../screens/RecoverPassword";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => (

    <Stack.Navigator>
        <Stack.Screen name = "Login" component={LoginScreen} options = {{headerShown: false}}/>
        <Stack.Screen name = "EmailVerification" component={EmailVerificationScreen} options = {{headerShown: false}}/>
        <Stack.Screen name = "Register" component={RegisterScreen} options = {{headerShown: false}}/>
        <Stack.Screen name = "RecoverPassword" component={RecoverPassword} options = {{headerShown: false}}/>

    </Stack.Navigator>
)

export default AuthNavigator;