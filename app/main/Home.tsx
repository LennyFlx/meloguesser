import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors} from "@/styles/colors";
import {Image} from "expo-image";
import {router} from "expo-router";
import {ROUTES} from "@/constants/routes";
import MainButton from "@/components/MainButton";
import {IMAGES} from "@/constants/images";
import BackgroundLayout from "@/components/BackgroundLayout";
import {useSpotifyAuth} from "@/auth/spotifyAuth";
import {handleAuthResponse} from "@/auth/authService";
import {useEffect, useState} from "react";
import {deleteToken, getToken} from "@/auth/tokenService";
import {fetchUserData} from "@/services/userServices";
import {IUserResponse} from "@/types/spotify";

export default function Home() {
    const {promptAsync, request, response} = useSpotifyAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<IUserResponse | null>(null);

    const loadUserProfile = async () => {
        const userData = await fetchUserData();
        if (userData) {
            setUser(userData);
        }
    }

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await getToken();
            const loggedIn = !!token;
            setIsLoggedIn(loggedIn);
            console.log("Token récupéré :", token);

            if (loggedIn) {
                loadUserProfile();
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (response) {
            handleAuthResponse(response, request).then(() => {

                const checkLoginStatus = async () => {
                    const token = await getToken();
                    setIsLoggedIn(!!token);
                    if (token) {
                       loadUserProfile();
                    }
                };
                checkLoginStatus();
            });
        }
    }, [response]);

    const handleSpotifyLogin = () => {
        promptAsync();
    };

    const handleLogout = async () => {
        await deleteToken();
        setIsLoggedIn(false);
        setUser(null);
        console.log("Utilisateur déconnecté");
    }

    return (
        <BackgroundLayout>
            <View style={{ flex: 0.7, alignItems : 'center', justifyContent: 'center' }}>
                {isLoggedIn ? (
                    <View style={styles.authContainer}>
                        <View style={styles.auth}>
                            <Image
                                source={require('../../assets/images/user.png')}
                                style={{ width: 20, height: 20, borderRadius: 25 }}
                            />
                            <Text style={styles.text}>
                                {user?.name}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={handleLogout}>
                                <Image
                                    source={require('../../assets/images/logout.png')}
                                    style={{ width: 20, height: 20}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => handleSpotifyLogin()}>
                        <View style={styles.auth}>
                            <Image
                                source={require('../../assets/images/spotify-white.svg')}
                                style={{ width: 30, height: 30, marginRight: 5 }}
                            />
                            <Text style={styles.text}>
                                Se connecter à ton Spotify
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
            <View style={{ flex: 2 }}>
                <Image
                    source={IMAGES.LOGO}
                    style={styles.image}
                />
            </View>
            <View style={{ flex: 2 }}>
                {!isLoggedIn && user?.product !== 'premium' ? (
                    <Text style={styles.subtext}>Compte Spotify Premium requis</Text>
                ) : null}
                <MainButton
                    onPress={() => router.push(ROUTES.CREATE)}
                    text="Créer une partie"
                    mode="primary"
                    disabled={!isLoggedIn || user?.product !== 'premium'}
                />
                <MainButton
                    onPress={() => router.push(ROUTES.JOIN)}
                    text="Rejoindre une partie"
                    mode="primary"
                />
                <MainButton
                    onPress={() => {}}
                    text="Comment jouer ?"
                    mode="secondary"
                />
            </View>
        </BackgroundLayout>
    );
}

const styles = StyleSheet.create({
    authContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        width: '100%'
    },
    auth: {
        backgroundColor: colors.black30,
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    text: {
        color: colors.white,
        fontFamily: 'Fredoka-Bold',
        fontSize: 20,
    },
    subtext: {
        color: colors.white,
        fontFamily: 'Figtree-Regular',
        fontSize: 12,
    },
    image: {
        width: 250,
        height: 250,
        resizeMode: "contain",
        alignSelf: 'center',
    }
})