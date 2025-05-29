import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {colors} from "@/styles/colors";

interface IProps {
    onPress: () => void;
    text: string;
    selected: boolean;
}

export default function CustomRadio(props: IProps) {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={[
                styles.radios,
                props.selected ? {backgroundColor: colors.pink} : {}
            ]}
        >
            <Text style={styles.radiosText}>{props.text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    radios: {
        backgroundColor: colors.white30,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    radiosText: {
        fontFamily: "Figtree-Regular",
        color: colors.white,
        fontSize: 12,
    },
})