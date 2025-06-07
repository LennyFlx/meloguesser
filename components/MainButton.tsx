import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors} from "@/styles/colors";

interface IProps {
    onPress: () => void;
    text: string;
    mode: 'primary' | 'secondary';
}

export default function MainButton(props: IProps) {
    return (
        <TouchableOpacity onPress={props.onPress} activeOpacity={1}>
            <View style={[
                styles.buttonBorder,
                props.mode === 'primary' ? styles.buttonBorderPrimary : styles.buttonBorderSecondary
            ]}>
                <View style={[
                    styles.button,
                    props.mode === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary
                ]}>
                    <Text style={styles.text}>
                        {props.text}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonBorder: {
        borderWidth: 2,
        borderRadius: 25,
        padding: 5,
        marginVertical: 10,
    },
    buttonPrimary: {
        backgroundColor: colors.pink,
    },
    buttonBorderPrimary: {
        borderColor: colors.pink,
    },
    buttonSecondary: {
        backgroundColor: colors.white30,
    },
    buttonBorderSecondary: {
        borderColor: colors.white30,
    },
    text: {
        color: colors.white,
        fontFamily: 'Fredoka-Bold',
        fontSize: 20,
    }
})