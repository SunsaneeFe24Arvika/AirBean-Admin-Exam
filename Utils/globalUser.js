
let currentUserId = null;

export function setCurrentUser(userId) {
    currentUserId = userId;
}

export function getCurrentUser() {
    return currentUserId;
}

export function clearCurrentUser() {
    currentUserId = null;
}