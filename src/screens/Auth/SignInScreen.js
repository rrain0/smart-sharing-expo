import React, { useState, useContext, useEffect } from 'react';
import {
    TouchableOpacity,
    Text, View,
    StyleSheet, Dimensions,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    Container, Input,
    Button, Popup
} from '@c'
import { AppContext, prettyPrint } from '@u'
import { useTheme, useThemeObj } from '@h';
import { OAuthComponent } from './OAuthComponent';

import * as userService from '@se/userService';
import {useAuth} from "@h/useAuth";

const dimensions = Dimensions.get("window");
const { width: FULL_WIDTH } = dimensions;

const makeStyles = (theme) => StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    View: {
        marginHorizontal: 20,
        width: FULL_WIDTH - 40
    },
    HeaderText: {
        fontFamily: theme.font.family,
        color: theme.font.headerColor,
        letterSpacing: theme.font.letterSpacing2,
        fontSize: 13,
    },
    mainHeader: {
        marginTop: '20%',
        color: theme.colors.mainColor,
        fontFamily: theme.font.familyBold,
        letterSpacing: theme.font.letterSpacing3,
        fontWeight: 'bold',
        fontSize: 36,
        marginBottom: 50
    },
    recoveryView: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    recoveryText: {
        color: theme.font.color,
        fontFamily: theme.font.family,
        letterSpacing: theme.font.letterSpacing0,
        fontSize: 13,
    },
    recoveryTouchText: {
        color: theme.colors.mainColor,
        fontFamily: theme.font.family,
        letterSpacing: theme.font.letterSpacing0,
        fontSize: 13,
    },
    separator: {
        marginTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    separatorLine: {
        height: 1,
        flex: 1,
        backgroundColor: theme.font.separatorColor
    },
    separatorText: {
        color: theme.font.separatorColor,
        fontFamily: theme.font.family,
        letterSpacing: theme.font.letterSpacing0,
        fontSize: 13,
        marginHorizontal: 13
    },
    oauthView: {
        marginVertical: 20,
        flexDirection: 'row',
    },
    logoView: {
        height: 40,
        width: 40,
        borderColor: theme.font.separatorColor,
        borderRadius: 20,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10
    }
})

function SignInScreen({ navigation }) {
    const styles = useTheme(theme => makeStyles(theme), []);

    const { setUser, setJwt } = useAuth()

    const [phoneOrEmail, setPhoneOrEmail] = useState('');
    const [password, setPassword] = useState('');

    const [popup, setPopup] = useState(false);
    const [popupText, setPopupText] = useState('');

    const singIn = async () => {
        const { error, jwt, user } = await userService.signIn({
            phoneOrEmail,
            password
        })

        if (error) {
            switch (error.code){
                case "incorrect-login": setPopupText('Неверный телефон или неверная почта'); break
                case 'incorrect-password': setPopupText('Неверный пароль'); break
                case 'incorrect-data': setPopupText('Некорректные данные'); break
                case 'errors': alert(JSON.stringify(error.data, '*', 2)); break
            }
            setPopup(true)
            return
        }

        setJwt(jwt)
        setUser(user)
        navigation.navigate('Profile');
    }

    return (
        <Container style={styles.container}>
            <ScrollView>
                <View style={styles.View}>
                    <Text style={styles.mainHeader}>{'SMART\nSHARING'}</Text>
                    <Text style={styles.HeaderText}>Номер телефона или почта</Text>
                    <Input
                        placeholder='Телефон или почта'
                        type='default'
                        onChange={(text) => setPhoneOrEmail(text)}
                        autoCompleteType='username'
                    />
                    <Text style={styles.HeaderText}>Пароль</Text>
                    <Input
                        placeholder='Пароль'
                        type='password'
                        check={false}
                        onChange={(password) => setPassword(password)}
                    // startErrroText={false}
                    />
                    <Button
                        placeholder='Вход'
                        style={{
                            marginBottom: 20
                        }}
                        onPress={singIn}
                    />
                    <View style={styles.recoveryView}>
                        <Text style={styles.recoveryText}>Забыли свою почту или пароль? </Text>
                        <TouchableOpacity><Text style={styles.recoveryTouchText}>Восстановить</Text></TouchableOpacity>
                    </View>
                </View>
                <OAuthComponent redirectScreen={'MapScreen'} />
                <View style={styles.recoveryView}>
                    <Text style={styles.recoveryText}>Увас еще нет аккаунта? </Text>
                    <TouchableOpacity><Text style={styles.recoveryTouchText}>Зарегестируйтесь</Text></TouchableOpacity>
                </View>
            </ScrollView>
            <Popup
                visible={popup}
                setVisible={setPopup}
                text={popupText}
                icon={<Icon
                    name='alert-circle'
                    size={30}
                    color='#fff'
                />}
            />
        </Container>
    )
}

export { SignInScreen };