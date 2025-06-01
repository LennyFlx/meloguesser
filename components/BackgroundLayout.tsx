import React, { ReactNode } from "react";
import {ImageBackground, SafeAreaView, StyleSheet} from "react-native";
import { IMAGES } from "@/constants/images";

type BackgroundLayoutProps = {
    children: ReactNode;
};

export default function BackgroundLayout(props: BackgroundLayoutProps) {
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={IMAGES.BACKGROUND}
                style={styles.background}
            >
                {props.children}
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
});