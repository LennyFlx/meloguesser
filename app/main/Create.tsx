import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import BackgroundLayout from "@/components/BackgroundLayout";
import {mainTitle} from "@/styles/titles";
import {colors} from "@/styles/colors";
import CustomRadio from "@/components/CustomRadio";
import {useEffect, useState} from "react";
import MainButton from "@/components/MainButton";
import {IPlaylist} from "@/types/spotify";
import {getMGPlaylists, getPlaylistsLiked, getUserPlaylists} from "@/services/playlistService";
import {Image} from "expo-image";
import ModalPlaylist from "@/components/ModalPlaylist";

enum PlaylistType {
    LIKED = 'liked',
    MY = 'my',
    MG = 'mg'
}

export default function Create() {
    const [playlistType, setPlaylistType] = useState<PlaylistType>(PlaylistType.LIKED)
    const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [playlistToShow, setPlaylistToShow] = useState<IPlaylist | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [selectedPlaylist, setSelectedPlaylist] = useState<IPlaylist | null>(null);

    const openModal = (playlist: IPlaylist) => {
        setPlaylistToShow(playlist);
        setIsModalVisible(true);
    }

    const handlePlaylistTypeChange = (type: PlaylistType) => {
        setPlaylistType(type);
    }

    useEffect(() => {
        const fetchPlaylists = async () => {
            switch (playlistType) {
                case PlaylistType.LIKED:
                    try {
                        setIsLoading(true);
                        const fetchedPlaylistsLiked = await getPlaylistsLiked("warnoxxx"); // Replace with actual user ID
                        if (fetchedPlaylistsLiked) {
                            setPlaylists(fetchedPlaylistsLiked);
                        } else {
                            setPlaylists([]);
                        }
                    } catch (error) {
                        console.error("Erreur lors du chargement des playlists likées:", error);
                        setPlaylists([]);
                    } finally {
                        setIsLoading(false);
                    }
                    break;
                case PlaylistType.MY:
                    try {
                        setIsLoading(true);
                        const fetchedMyPlaylists = await getUserPlaylists("warnoxxx"); // Replace with actual user ID
                        if (fetchedMyPlaylists) {
                            setPlaylists(fetchedMyPlaylists);
                        } else {
                            setPlaylists([]);
                        }
                    } catch (error) {
                        console.error("Erreur lors du chargement des playlists de l'utilisateur:", error);
                        setPlaylists([]);
                    } finally {
                        setIsLoading(false);
                    }
                    console.log("Fetching my playlists");
                    break;
                case PlaylistType.MG:
                    try {
                        setIsLoading(true);
                        const mgPlaylists = await getMGPlaylists();
                        if (mgPlaylists) {
                            setPlaylists(mgPlaylists);
                        } else {
                            setPlaylists([]);
                        }
                    } catch (error) {
                        console.error("Erreur lors du chargement des playlists MG:", error);
                        setPlaylists([]);
                    } finally {
                        setIsLoading(false);
                    }
                    console.log("Fetching MG playlists");
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
                    Mauris mollis enim a purus viverra egestas.
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
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.white}/>
                        <Text style={styles.playlistSubtitle}>Chargement des playlists</Text>
                    </View>
                    ) :
                playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <View key={playlist.id} style={styles.playlistItemContainer}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {setSelectedPlaylist(playlist)}}
                                style={[
                                    styles.playlistItem,
                                    selectedPlaylist?.id === playlist.id ? styles.selectedPlaylist : {}
                                ]}
                            >
                                <Image style={styles.playlistImage} source={playlist.image}/>
                                <View style={styles.playlistInfo}>
                                    {playlist.name.length > 23 ? (
                                        <Text style={styles.playlistTitle}>{playlist.name.slice(0, 23)} ...</Text>
                                    ) : (
                                        <Text style={styles.playlistTitle}>{playlist.name}</Text>
                                    )
                                    }
                                    <Text style={styles.playlistSubtitle}>{playlist.owner.name}   -   {playlist.tracks?.total} titres</Text>
                                </View>
                                <TouchableOpacity style={styles.listIconContainer} onPress={() => openModal(playlist)}>
                                    <Image style={styles.listIcon} contentFit="contain" source={require('../../assets/images/list-icon.svg')}/>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.text}>Aucune playlist trouvée</Text>
                )}
            </ScrollView>
            <View style={styles.selectedPlaylistContainer}>
                <Text style={styles.selectedPlaylistText}>Playlist sélectionné :</Text>
                { selectedPlaylist ? (
                    <View style={styles.selectedPlaylistItem}>
                        <Image style={styles.playlistImage} source={selectedPlaylist.image}/>
                        <View style={styles.playlistInfo}>
                            {selectedPlaylist.name.length > 23 ? (
                                <Text style={styles.playlistTitle}>{selectedPlaylist.name.slice(0, 23)} ...</Text>
                            ) : (
                                <Text style={styles.playlistTitle}>{selectedPlaylist.name}</Text>
                            )
                            }
                            <Text style={styles.playlistSubtitle}>{selectedPlaylist.owner.name}   -   {selectedPlaylist.tracks?.total} titres</Text>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.selectedPlaylistTextInfo}>Aucune playlist sélectionnée</Text>
                )}
            </View>
            <View style={{}}>
                <MainButton onPress={() => {}} text={'Je choisi cette playlist'} mode={"primary"}/>
            </View>
            {playlistToShow && isModalVisible && (
                <ModalPlaylist
                    visible={isModalVisible}
                    setVisible={setIsModalVisible}
                    playlistData={playlistToShow}
                />
            )}
        </BackgroundLayout>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        gap: 10
    },
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
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.white30,
        flexDirection: "row",
    },
    playlistItem: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
        borderRadius: 10,
        padding: 10,
    },
    playlistImage: {
        height: 50,
        width: 50,
        borderRadius: 10
    },
    playlistInfo: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        gap: 10
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
    listIcon: {
        width: 25,
        height: 25,
    },
    listIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedPlaylistText: {
        fontFamily: "Figtree-Black",
        color: colors.white,
        fontSize: 16,
        textAlign: "center",
    },
    selectedPlaylistTextInfo: {
        fontFamily: "Figtree-Regular",
        fontSize: 14,
        textAlign: 'center'
    },
    selectedPlaylistContainer: {
        gap: 15,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 5
    },
    selectedPlaylistItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        width: '100%',
        backgroundColor: colors.white30,
        borderRadius: 20
    },
    selectedPlaylist: {
        backgroundColor: colors.white30,
    }

})