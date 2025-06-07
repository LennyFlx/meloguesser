import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import BackgroundLayout from "@/components/BackgroundLayout";
import {mainTitle} from "@/styles/titles";
import {colors} from "@/styles/colors";
import CustomRadio from "@/components/CustomRadio";
import React, {useCallback, useEffect, useState} from "react";
import MainButton from "@/components/MainButton";
import {IPlaylist, PlaylistType} from "@/types/spotify";
import {fetchNextPlaylists, fetchPlaylists} from "@/services/playlistService";
import {Image} from "expo-image";
import ModalPlaylist from "@/components/ModalPlaylist";

export default function Create() {
    const [playlistType, setPlaylistType] = useState<PlaylistType>(PlaylistType.LIKED)
    const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

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

        const getPlaylists = async () => {
            try {
                setIsLoading(true);
                const playlists = await fetchPlaylists(playlistType)
                if (playlists) {
                    setPlaylists(playlists.items);
                    setNextUrl(playlists.next || null);
                } else {
                    setPlaylists([]);
                    setNextUrl(null);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des playlists:", error);
                setPlaylists([]);
                setNextUrl(null);
            } finally {
                setIsLoading(false);
            }
        };
        getPlaylists();
    }, [playlistType]);

    const loadMorePlaylists = async (next: string) => {
        const playlist = await fetchNextPlaylists(next, playlistType);
        if (playlist) {
            setPlaylists(prevPlaylists => [...prevPlaylists, ...playlist.items]);
            setNextUrl(playlist.next || null);
        } else {
            setNextUrl(null);
        }
    }

    // TODO: Problème de récupération des playlists: Doublons lors du scroll event

    const handleLoadMore = useCallback(() => {
        if (nextUrl && !loadingMore && !isLoading) {
            setLoadingMore(true);
            loadMorePlaylists(nextUrl);
        } else  {
            setLoadingMore(false);
        }
    }, [nextUrl, loadingMore, isLoading]);

    const renderItem = ({item}: {item: IPlaylist}) => (
        <View key={item.id} style={styles.playlistItemContainer}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {setSelectedPlaylist(item)}}
                style={[
                    styles.playlistItem,
                    selectedPlaylist?.id === item.id ? styles.selectedPlaylist : {}
                ]}
            >
                <Image style={styles.playlistImage} source={{uri: item.image}}/>
                <View style={styles.playlistInfo}>
                    {item.name.length > 23 ? (
                        <Text style={styles.playlistTitle}>{item.name.slice(0, 23)} ...</Text>
                    ) : (
                        <Text style={styles.playlistTitle}>{item.name}</Text>
                    )}
                    <Text style={styles.playlistSubtitle}>{item.owner.name}   -   {item.tracks?.total} titres</Text>
                </View>
                <TouchableOpacity style={styles.listIconContainer} onPress={() => openModal(item)}>
                    <Image style={styles.listIcon} contentFit="contain" source={require('../../assets/images/list-icon.svg')}/>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color={colors.white} />
                <Text style={styles.playlistSubtitle}>Chargement...</Text>
            </View>
        );
    };

    return (
        <BackgroundLayout isBlurred={isModalVisible}>
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
                {isLoading ? (
                    <View style={styles.playlistContainer}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.white}/>
                            <Text style={styles.playlistSubtitle}>Chargement des playlists</Text>
                        </View>
                    </View>
                    ) :
                playlists.length > 0 ? (
                    <FlatList
                        style={styles.playlistContainer}
                        data={playlists}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        onEndReached={() => handleLoadMore()}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={renderFooter}
                        maxToRenderPerBatch={5}
                        initialNumToRender={10}
                        removeClippedSubviews={true}
                    />
                ) : (
                    <Text style={styles.text}>Aucune playlist trouvée</Text>
                )}
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
    },
    footerLoading: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
})