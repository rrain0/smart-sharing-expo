import 'react-native-gesture-handler';
import React, { useMemo, useReducer, useEffect, useCallback, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNetInfo } from "@react-native-community/netinfo";
import io from 'socket.io-client';
import { NOTIFICATIONS_API_URL, NOTIFICATIONS_SOCKET_NAMESPACE, NOTIFICATIONS_SOCKET_PATH } from "@env";

import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { WelcomeSreen, Auth, OAuth, PreloaderSreen } from '@sc';
import { AppNavigation, LoginNavigation } from '@n';
import { AppContext, prettyPrint, reducer } from '@u';
import { useUser, loadTheme } from '@h';
import { Notification } from '@c';

import * as userService from '@se/userService';


const RootNavigation = createStackNavigator();

// BackgroundTask.define(() => {
// 	console.log('Hello from a background task')
// 	BackgroundTask.finish()
// })

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

function App() {
    const { isConnected } = useNetInfo();

    const [theme, setTheme] = loadTheme();

    const [loading, user, setUser] = useUser();

    const [state, dispatch] = useReducer(reducer.reducer, reducer.initState);

    const preloading = useMemo(() => !isConnected || loading || !theme, [isConnected, loading, theme]);

    // const [initialState, setInitialState] = useState();
    // const [isReady, setIsReady] = useState(false);

    // useEffect(() => {
    // 	const restoreState = async () => {
    // 		try {
    // 			const initialUrl = await Linking.getInitialURL();

    // 			if (Platform.OS !== 'web' && initialUrl == null) {
    // 				// Only restore state if there's no deep link and we're not on web
    // 				const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
    // 				const state = savedStateString ? JSON.parse(savedStateString) : undefined;

    // 				if (state !== undefined) {
    // 					setInitialState(state);
    // 				}
    // 			}
    // 		} finally {
    // 			setIsReady(true);
    // 		}
    // 	};

    // 	if (!isReady) {
    // 		restoreState();
    // 	}
    // }, [isReady]);

    // if (!isReady) {
    // 	return null;
    // }

    // useEffect(() => {
    // 	BackgroundTask.schedule({
    // 		period: 10
    // 	})

    const [socket, setSocket] = useState(null);
    const [notification, setNotification] = useState({});
    const [notificationVisibale, setNotificationVisible] = useState(false)

    const updateJwt = useCallback(async socket_ => {
        socket_.disconnect();
        setSocket(null);

        const { status, payload } = await userService.getCurrentJwt();
        // @ts-ignore
        setUser({ ...user, jwt: payload });
        initSocket(payload);
    }, []);

    const initSocket = useCallback(jwt => {
        const socket_ = io(`${NOTIFICATIONS_API_URL}${NOTIFICATIONS_SOCKET_NAMESPACE}`, {
            path: `${NOTIFICATIONS_SOCKET_PATH}/socket.io`,
            extraHeaders: {
                authorization: `Bearer ${jwt}`
            }
        });

        socket_.on("connect", () => console.info("Sockets connected"));
        socket_.on("disconnect", () => console.log("Sockets disconnected"));

        socket_.on("connect_error", err => {
            if (err.message === "JWT_EXPIRED") {
                updateJwt(socket_);
            }
        });

        socket_.on("updateJwt", () => updateJwt(socket_));

        socket_.on("notification",
            // ({ module: modulee, action, title, description, type, extra, save })
            (notification) => {
                prettyPrint(notification);
                Vibration.vibrate(200);

                if (notification.save) {
                    // @ts-ignore
                    dispatch({
                        type: 'addNotification',
                        payload: notification
                    })
                }

                setNotification(notification);
                setNotificationVisible(true);
            });

        // @ts-ignore
        setSocket(socket_);
    }, []);

    useEffect(() => {
        if (!user && socket) {
            // @ts-ignore
            socket.disconnect();
            setSocket(null);
        }
        else if (user && !socket) {
            // @ts-ignore
            initSocket(user.jwt);
        }
    }, [user]);


    return (
        <AppContext.Provider
            value={{
                user, setUser,
                theme, setTheme,
                dispatch, state
            }}
        >
            {preloading && <PreloaderSreen />}
            {!preloading &&
                <>
                    <NavigationContainer
                        // initialState={initialState}
                        // onStateChange={(state) =>
                        // 	AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
                        // }
                    >
                        {/*headerMode='none'*/}
                        <RootNavigation.Navigator     initialRouteName='AppNavigation'>
                            <RootNavigation.Screen name='WelcomeScreen' component={WelcomeSreen} />
                            <RootNavigation.Screen name='Login' component={LoginNavigation} />
                            <RootNavigation.Screen name='SignUpScreen' component={Auth.SignUpSreen} />
                            <RootNavigation.Screen name='SignInScreen' component={Auth.SignInSreen} />
                            <RootNavigation.Screen name="OAuthStatusScreen" component={OAuth.StatusScreen} />
                            <RootNavigation.Screen name='OAuthSignInScreen' component={OAuth.SignInSreen} />
                            <RootNavigation.Screen name='OAuthSignUpScreen' component={OAuth.SignUpSreen} />
                            <RootNavigation.Screen name='AppNavigation' component={AppNavigation} />
                        </RootNavigation.Navigator>
                    </NavigationContainer>
                    {/*@ts-ignore*/}
                    <Notification visible={notificationVisibale} setVisible={setNotificationVisible}
                        notification={notification}
                        onPress={() => {
                            //prettyPrint(navigationRef)
                            // 	navigation.navigate('AppNavigation', {
                            // 	screen: 'Notifications'
                            // })
                        }}
                    />
                </>
            }
        </AppContext.Provider>
    )
}

export default App;








// было в шаблоне:

//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';

/*export default function App() {
    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});*/
