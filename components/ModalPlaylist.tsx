import {IPlaylist, ITrack, ITrackResponse} from "@/types/spotify";
import React, {useState, useEffect, useCallback} from "react";
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    NativeSyntheticEvent, NativeScrollEvent, FlatList
} from "react-native";
import {Image} from "expo-image";
import {colors} from "@/styles/colors";
import {getTracksFromPlaylist} from "@/services/trackService";
import {TRACK_LIMIT} from "@/constants/limits";


interface IModal {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    playlistData: IPlaylist
}

export default function ModalPlaylist(props: IModal) {
    const [tracks, setTracks] = useState<ITrack[]>([]);
    const [tracksUrl, setTracksUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    useEffect(() => {
        setTracksUrl(props.playlistData.tracks?.href || "");
        const fetchTracks = async () => {
            if (tracksUrl) {
                setIsLoading(true);
                try {
                    const fetchedTracks = await getTracksFromPlaylist(tracksUrl + TRACK_LIMIT);
                    if (fetchedTracks) {
                        setTracks(fetchedTracks.items);
                        setNextUrl(fetchedTracks.next || null);
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

    const loadMoreTracks = async (url: string) => {
        try {
            const response = await getTracksFromPlaylist(url);
            if (response && response.items) {
                setTracks(prevTracks => [...prevTracks, ...response.items]);
                setNextUrl(response.next);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des pistes supplémentaires:", error);
        } finally {
            setIsLoading(false);
            setLoadingMore(false);
        }
    }

    const handleLoadMore = useCallback(() => {
        if (nextUrl && !loadingMore && !isLoading) {
            setLoadingMore(true);
            loadMoreTracks(nextUrl);
        }
    }, [nextUrl, loadingMore, isLoading]);

    const handleClose = () => {
        props.setVisible(false);
    }

    const renderTrackItem = ({ item }: { item: ITrack }) => (
        <View key={item.id} style={styles.trackItem}>
            <Image source={item.image} style={styles.trackImage}/>
            <View style={styles.trackInfo}>
                {item.name.length > 23 ? (
                    <Text style={styles.trackTitle}>{item.name.slice(0, 23)} ...</Text>
                ) : (
                    <Text style={styles.trackTitle}>{item.name}</Text>
                )}
                <Text style={styles.trackText}>{item.artists.map(artist => artist.name).join(", ")}</Text>
                <Text style={styles.trackText}>{item.releaseDate}</Text>
            </View>
        </View>
    );


    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color={colors.white} />
                <Text style={styles.trackText}>Chargement...</Text>
            </View>
        );
    };

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
                    {isLoading && tracks.length === 0 ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.white} />
                            <Text style={styles.trackText}>Chargement des pistes...</Text>
                        </View>
                    ) : tracks.length > 0 ? (
                        <FlatList
                            style={styles.tracksContainer}
                            data={tracks}
                            renderItem={renderTrackItem}
                            keyExtractor={(item) => item.id}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.2}
                            ListFooterComponent={renderFooter}
                            maxToRenderPerBatch={10}
                            initialNumToRender={10}
                            removeClippedSubviews={true}
                        />
                    ) : (
                        <Text style={styles.trackText}>Aucune piste trouvée dans cette playlist.</Text>
                    )}
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
    footerLoading: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
