import React, { memo } from 'react'
import { Alert, Linking, StyleSheet, TouchableOpacity } from 'react-native'
import SongItemCommentBar from './SongItemCommentBar'
import SongItemDetail from './SongItemDetail'

const SongItem = ({ songData }) => {
    // Actions
    const openSongDeepLinkAction = platformDeepLink => {
        Linking.canOpenURL(platformDeepLink)
            .then(isSupported => {
                if (!isSupported) {
                    Alert.alert('Song is not supported 😶')
                    return
                }

                Linking.openURL(platformDeepLink).catch(() => {
                    Alert.alert('Unable to open song 👎')
                })
            })
            .catch(() => {
                Alert.alert('Invalid song 😐')
            })
    }

    return (
        <>
            <TouchableOpacity
                style={styles.Container}
                onPress={() => {
                    openSongDeepLinkAction(songData.platformDeepLink)
                }}
            >
                <SongItemDetail songData={songData} />
            </TouchableOpacity>
            <SongItemCommentBar songData={songData} />
        </>
    )
}

// Styles
const styles = StyleSheet.create({
    Container: {
        paddingBottom: 25,
        flex: 1,
    },
})

export default memo(SongItem)
