import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors} from "@/styles/colors";
import {Image} from "expo-image";
import {router} from "expo-router";
import {ROUTES} from "@/constants/routes";
import MainButton from "@/components/MainButton";
import {IMAGES} from "@/constants/images";
import BackgroundLayout from "@/components/BackgroundLayout";

export default function Home() {
    return (
        <BackgroundLayout>
            <View style={{ flex: 0.7, alignItems : 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => {}}>
                    <View style={styles.auth}>
                        <Text style={styles.text}>
                            Se connecter à ton Spotify
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 2 }}>
                <Image
                    source={IMAGES.LOGO}
                    style={styles.image}
                />
            </View>
            <View style={{ flex: 2 }}>
                <MainButton
                    onPress={() => router.push(ROUTES.CREATE)}
                    text="Créer un partie"
                    mode="primary"
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
    auth: {
        backgroundColor: colors.white30,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: colors.white,
        fontFamily: 'Fredoka-Bold',
        fontSize: 20,
    },
    image: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
        alignSelf: 'center',
    }
})