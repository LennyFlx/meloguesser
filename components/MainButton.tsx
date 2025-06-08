import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors} from "@/styles/colors";

interface IProps {
    onPress: () => void;
    text: string;
    mode: 'primary' | 'secondary';
    disabled?: boolean;
}

export default function MainButton(props: IProps) {
    return (
        <TouchableOpacity onPress={props.onPress} activeOpacity={1} disabled={props.disabled}>
            <View style={[
                props.disabled ? styles.buttonBorderDisabled : styles.buttonBorder,
                props.mode === 'primary' ? styles.buttonBorderPrimary : styles.buttonBorderSecondary
            ]}>
                <View style={[
                    props.disabled ? styles.buttonDisabled : styles.button,
                    props.mode === 'secondary' && !props.disabled ? styles.buttonSecondary : null,
                    props.mode === 'primary' && !props.disabled? styles.buttonPrimary : null
                ]}>
                    <Text style={props.disabled ? styles.textDisabled : styles.text}>
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
    buttonDisabled: {
        backgroundColor: colors.black30,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonBorderDisabled: {
        padding: 5,
        marginVertical: 10,
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
    textDisabled: {
        color: colors.white30,
        fontFamily: 'Fredoka-Bold',
        fontSize: 20,
    },
    text: {
        color: colors.white,
        fontFamily: 'Fredoka-Bold',
        fontSize: 20,
    }
})