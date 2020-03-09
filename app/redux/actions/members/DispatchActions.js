export const AddMember = (membersState, member) => {
    const byId = { ...membersState.byId }
    byId[member.id] = member

    const allIds = [...membersState.allIds, member.id]

    return { byId, allIds }
}

export const FetchMembers = (membersState, members) => {
    // Get user state playlists, map through IDs, and return
    if (members.length === 0) return membersState

    // TODO: Think if we want to use reduce vs forEach (O(n^2) vs O(n))
    const reducedMembers = members.reduce(
        (state, currentMember) => {
            return {
                byId: {
                    ...state.byId,
                    [currentMember.id]: currentMember,
                },
                allIds: [...state.allIds, currentMember.id],
            }
        },
        { byId: {}, allIds: [] }
    )

    reducedMembers.byId = { ...reducedMembers.byId, ...membersState.byId }
    reducedMembers.allIds = [...reducedMembers.allIds, ...membersState.allIds]

    return reducedMembers
}
