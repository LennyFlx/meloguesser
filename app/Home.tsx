import {SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {colors} from "@/styles/colors";
import {Image, ImageBackground} from "expo-image";
import {router} from "expo-router";

export default function Home() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require("../assets/images/background.png")}
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    padding: 30,
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text>Connexion</Text>
                </View>
                <View style={{ flex: 2 }}>
                    <Image
                        source={require("../assets/images/logo.png")}
                        style={{
                            width: 250,
                            height: 220,
                            resizeMode: 'contain',
                            alignSelf: 'center',
                        }}
                    />
                </View>
                <View style={{ flex: 2 }}>
                    <TouchableOpacity onPress={() => router.push('/Create')}>
                        <View
                            style={{
                                backgroundColor: colors.pink,
                                borderRadius: 20,
                                padding: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.white,
                                    fontFamily: 'Fredoka-Bold',
                                    fontSize: 18,
                                }}
                            >
                                Créer une partie
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}