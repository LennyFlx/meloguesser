import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SpotifyRedirect() {
    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        const code = params.code;

        if (code) {
            console.log("Code d'autorisation reçu:", code);

            setTimeout(() => {
                router.replace('/');
            }, 1000);
        } else {
            console.error("Aucun code d'autorisation reçu");
            router.replace('/');
        }
    }, []);



    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Connexion à Spotify en cours...</Text>
        </View>
    );
}