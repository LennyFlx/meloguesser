import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import BackgroundLayout from "@/components/BackgroundLayout";
import {mainTitle} from "@/styles/titles";
import {colors} from "@/styles/colors";
import CustomRadio from "@/components/CustomRadio";
import {useEffect, useState} from "react";
import MainButton from "@/components/MainButton";
import {IPlaylist} from "@/types/spotify";
import {getPlaylistsLiked} from "@/services/playlistService";
import {Image} from "expo-image";

enum PlaylistType {
    LIKED = 'liked',
    MY = 'my',
    MG = 'mg'
}

export default function Create() {
    const [playlistType, setPlaylistType] = useState<PlaylistType>(PlaylistType.LIKED)
    const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

    const handlePlaylistTypeChange = (type: PlaylistType) => {
        setPlaylistType(type);
    }

    useEffect(() => {
        const fetchPlaylists = async () => {
            switch (playlistType) {
                case PlaylistType.LIKED:
                    try {
                        const fetchedPlaylistsLiked = await getPlaylistsLiked("warnoxxx");
                        if (fetchedPlaylistsLiked) {
                            setPlaylists(fetchedPlaylistsLiked);
                        } else {
                            setPlaylists([]);
                        }
                        console.log("Fetching liked playlists", fetchedPlaylistsLiked);
                    } catch (error) {
                        console.error("Erreur lors du chargement des playlists likées:", error);
                        setPlaylists([]);
                    }
                    break;
                case PlaylistType.MY:
                    // Fetch user's own playlists
                    console.log("Fetching my playlists");
                    break;
                case PlaylistType.MG:
                    // Fetch playlists from the music group
                    console.log("Fetching music group playlists");
                    break;
                default:
                    console.log("Unknown playlist type");
            }
        };
        fetchPlaylists();
    }, [playlistType]);

    return (
        <BackgroundLayout>
            <View style={{}}>
                <Text style={mainTitle}>Choisis ta playlist</Text>
            </View>
            <View style={{marginVertical: 5}}>
                <Text style={styles.text}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris mollis enim a purus viverra egestas.aa
                    Nam non leo fringilla, consequat felis eu, ultrices justo.
                    Morbi at turpis posuere, condimentum erat et, porttitor metus.
                </Text>
            </View>
            <View style={{justifyContent: 'center', marginVertical: 5}}>
                <View style={styles.radiosContainer}>
                    <CustomRadio
                        onPress={() => handlePlaylistTypeChange(PlaylistType.LIKED)}
                        text={'Playlists likées'}
                        selected={playlistType === 'liked'}
                    />
                    <CustomRadio
                        onPress={() => handlePlaylistTypeChange(PlaylistType.MY)}
                        text={'Mes playlists'}
                        selected={playlistType === 'my'}
                    />
                    <CustomRadio
                        onPress={() => handlePlaylistTypeChange(PlaylistType.MG)}
                        text={'Playlists MG'}
                        selected={playlistType === 'mg'}
                    />
                </View>
            </View>
            <ScrollView style={styles.playlistContainer}>
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <View key={playlist.id} style={styles.playlistItemContainer}>
                            <View style={styles.playlistItem}>
                                <Image style={styles.playlistImage} source={playlist.image}/>
                                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", gap: 10 }}>
                                    {playlist.name.length > 23 ? (
                                        <Text style={styles.playlistTitle}>{playlist.name.slice(0, 23)} ...</Text>
                                    ) : (
                                        <Text style={styles.playlistTitle}>{playlist.name}</Text>
                                    )
                                    }
                                    <Text style={styles.playlistSubtitle}>{playlist.owner.name}   -   {playlist.tracks?.total} titres</Text>
                                </View>
                                <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => {}}>
                                    <Image style={{ width: 25, height: 25 }} contentFit="contain" source={require('../../assets/images/list-icon.svg')}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.text}>Aucune playlist trouvée</Text>
                )}
            </ScrollView>
            <View style={{}}>
                <MainButton onPress={() => {}} text={'Je choisi cette playlist'} mode={"primary"}/>
            </View>
        </BackgroundLayout>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "Figtree-Regular",
        color: colors.white,
        fontSize: 16,
    },
    radiosText: {
        fontFamily: "Figtree-Regular",
        color: colors.white,
        fontSize: 12,
    },
    radios: {
        backgroundColor: colors.white30,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    radiosContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    playlistContainer: {
        flex: 2.5,
        borderRadius: 20,
        backgroundColor: colors.white30,
    },
    playlistItemContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.white30,
        flexDirection: "row",
    },
    playlistItem: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        gap: 10
    },
    playlistImage: {
        height: 50,
        width: 50,
        borderRadius: 10
    },
    playlistTitle: {
        fontFamily: "Figtree-Black",
        fontSize: 14,
        color: colors.white,
    },
    playlistSubtitle: {
        fontFamily: "Figtree-Regular",
        fontSize: 12,
        color: colors.white,
    },
})