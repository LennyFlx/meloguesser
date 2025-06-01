import {IPlaylist, ITrack} from "@/types/spotify";
import React, {useState, useEffect} from "react";
import {Modal, View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator} from "react-native";
import {Image} from "expo-image";
import {colors} from "@/styles/colors";
import {getTracksFromPlaylist} from "@/services/trackService";


interface IModal {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    playlistData: IPlaylist
}

export default function ModalPlaylist(props: IModal) {
    const [tracks, setTracks] = useState<ITrack[]>([]);
    const [tracksUrl, setTracksUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setTracksUrl(props.playlistData.tracks?.href || "");
        const fetchTracks = async () => {
            if (tracksUrl) {
                setIsLoading(true);
                try {
                    const fetchedTracks = await getTracksFromPlaylist(tracksUrl);
                    if (fetchedTracks) {
                        setTracks(fetchedTracks);
                    } else {
                        setTracks([]);
                    }
                } catch (error) {
                    console.error("Erreur lors du chargement des pistes de la playlist:", error);
                    setTracks([]);
                } finally {
                    setIsLoading(false);
                }
            }
        }
        fetchTracks();
    }, [tracksUrl]);

    const handleClose = () => {
        props.setVisible(false);
    }

    return (
        <Modal style={styles.modalContainer} animationType="slide" visible={props.visible} transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.closeButton}>
                    <Pressable onPress={handleClose} style={{ padding: 10, zIndex: 1}}>
                        <Image source={require('../assets/images/close-icon.svg')} style={styles.closeIcon} />
                    </Pressable>
                </View>
                <View>
                    <Text style={styles.mainTitle}>Aperçu de la playlist</Text>
                </View>
                <View style={styles.playlistContainer}>
                    <Image source={props.playlistData.image} style={styles.playlistImage}/>
                    <View style={styles.playlistInfo}>
                        <Text style={styles.playlistTitle}>{props.playlistData.name}</Text>
                        <Text style={styles.playlistText}>{props.playlistData.owner.name}</Text>
                        <Text style={styles.playlistText}>{props.playlistData.tracks?.total} titres</Text>
                    </View>
                </View>
                <ScrollView style={styles.tracksContainer}>
                    {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={colors.white} />
                                <Text style={styles.trackText}>Chargement des pistes...</Text>
                            </View>
                    ) : tracks.length > 0 ? (
                        tracks.map((track: ITrack) => (
                            <View key={track.id} style={styles.trackItem}>
                                <Image source={track.image} style={styles.trackImage}/>
                                <View style={styles.trackInfo}>
                                    {track.name.length > 23 ? (
                                        <Text style={styles.trackTitle}>{track.name.slice(0, 23)} ...</Text>
                                    ) : (
                                        <Text style={styles.trackTitle}>{track.name}</Text>
                                    )}
                                    <Text style={styles.trackText}>{track.artists.map(artist => artist.name).join(", ")}</Text>
                                    <Text style={styles.trackText}>{track.releaseDate}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text>Aucune piste trouvée dans cette playlist.</Text>
                    )}
                </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        gap: 10
    },
    modalContainer: {
        height: "80%",
        flex: 1,
        marginTop: 70,
        marginHorizontal: 30,
        borderRadius: 20,
        padding: 20,
        backgroundColor: colors.dark
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    closeIcon: {
        width: 20,
        height: 20,
    },
    mainTitle: {
        fontFamily: "Fredoka-Bold",
        fontSize: 24,
        color: colors.white,
        textAlign: "center",
    },
    playlistContainer: {
        flexDirection: "row",
        marginVertical: 20,
        gap: 15,
    },
    playlistImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
    },
    playlistInfo: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        gap: 10,
    },
    playlistTitle: {
        fontFamily: "Figtree-Black",
        fontSize: 16,
        color: colors.white,
    },
    playlistText: {
        fontFamily: "Figtree-Regular",
        color: colors.white,
        fontSize: 14,
    },
    tracksContainer: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: colors.white30,
    },
    trackItem: {
        flexDirection: "row",
        gap: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.white30,
    },
    trackInfo: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        gap: 5,
    },
    trackImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    trackTitle: {
        fontFamily: "Figtree-Black",
        fontSize: 14,
        color: colors.white,
    },
    trackText: {
        fontFamily: "Figtree-Regular",
        fontSize: 12,
        color: colors.white,
    }

})
