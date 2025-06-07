import React, { ReactNode } from "react";
import {ImageBackground, SafeAreaView, StyleSheet, View} from "react-native";
import { IMAGES } from "@/constants/images";
import {BlurView} from "expo-blur";

type BackgroundLayoutProps = {
    children: ReactNode;
    isBlurred?: boolean;
};

export default function BackgroundLayout(props: BackgroundLayoutProps) {
    return (
        <SafeAreaView style={styles.container}>

            <ImageBackground
                source={IMAGES.BACKGROUND}
                style={styles.background}
            >
                {props.isBlurred && (
                    <BlurView
                        experimentalBlurMethod={'dimezisBlurView'}
                        intensity={15}
                        style={styles.blur}>
                    </BlurView>
                )}
                <View style={styles.contentContainer}>
                    {props.children}
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        paddingHorizontal: 30,
        paddingBottom: 40,
        paddingTop: 20,
    },
    blur: {
        width: '300%',
        height: '300%',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
    contentContainer: {
        flex: 1,
        zIndex: 5,
    },
});