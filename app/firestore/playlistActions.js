// LiquoriceLion - "I’m going to need those TPS reports… ASAP… So, if you could do that, that'd be great..." – Bill Lumbergh" (03/20/20)
// TheDkbay - "Do these even matter anymore? Also remember Corona future Alec? or nah?" (03/20/20)
// JMSWRNR - "the government is making us quarantine so they can change the batteries in the pigeons" (03/20/20)
import firestore from '@react-native-firebase/firestore'
import { FetchChildRefs } from './helpers'

export const CreateNewPlaylistDocument = async playlist => {
    try {
        // Write to DB
        const db = firestore()
        const playlistDoc = db.collection('playlists').doc(playlist.id)

        // Create reference to members if any
        const editedPlaylist = { ...playlist }

        if (editedPlaylist.members.length) {
            editedPlaylist.members = editedPlaylist.members.map(memberId =>
                db.doc(`users/${memberId}`)
            )
        }

        // Add reference for createdBy
        editedPlaylist.createdBy = db.doc(`users/${editedPlaylist.createdBy}`)

        // Initialize songs object
        editedPlaylist.songs = { addedBy: {}, allSongs: [] }

        // If our document creation is a success, we can set data in document
        await playlistDoc.set(editedPlaylist)

        return playlistDoc
    } catch (error) {
        console.warn(error)
    }

    return null
}

export const DeletePlaylistDocument = async playlistId => {
    const db = firestore()
    const playlistDocRef = await db.doc(`playlists/${playlistId}`)

    // Remove playlist document
    await playlistDocRef.delete()
}

export const GetPlaylists = async uid => {
    const db = firestore()
    const dbUsersSnap = await db
        .collection('users')
        .doc(uid)
        .get()

    const dbUser = dbUsersSnap.data()

    // Get Playlist Data And Reduce
    const playlistsData = await FetchChildRefs(dbUser.playlists)
    const reducedPlaylists = playlistsData.reduce((state, currentPlaylistData) => {
        return [
            ...state,
            {
                ...currentPlaylistData,
                createdBy: currentPlaylistData.createdBy.id,
                songs: {
                    addedBy: {
                        ...currentPlaylistData.songs.addedBy,
                    },
                    allSongs: currentPlaylistData.songs.allSongs.map(songRef => songRef.id),
                },
                members: currentPlaylistData.members.map(memberRef => memberRef.id),
            },
        ]
    }, [])

    return reducedPlaylists
}

export const RemovePlaylistRefFromUserDocument = async (uid, playlistId) => {
    const db = firestore()
    const userDocRef = await db.collection('users').doc(uid)

    db.runTransaction(transaction => {
        return transaction.get(userDocRef).then(userDoc => {
            if (!userDoc.exists) {
                throw new Error('userDoc did not exist.')
            }

            const currentPlaylists = userDoc.data().playlists
            transaction.update(userDocRef, {
                playlists: currentPlaylists.filter(playlistRef => playlistRef.id !== playlistId),
            })
        })
    })
}

export const UpdateUserDocumentWithPlaylist = async (uid, playlistRef) => {
    const db = firestore()
    const userDocRef = await db.collection('users').doc(uid)

    db.runTransaction(transaction => {
        return transaction.get(userDocRef).then(userDoc => {
            if (!userDoc.exists) {
                throw new Error('userDoc did not exist.')
            }

            const currentPlaylists = userDoc.data().playlists
            transaction.update(userDocRef, { playlists: [...currentPlaylists, playlistRef] })
        })
    })
}
