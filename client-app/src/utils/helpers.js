export const formatTime = (time) => {
    // Helper function to format a timestamp as a human-readable time
    // Assumes `time` is a Unix timestamp in seconds
    const date = new Date(time * 1000);
    return date.toLocaleTimeString();
}

export const displayError = (error) => {
    // Helper function to display an error message to the user
    console.error(error);
    alert('An error occurred. Please try again later.');
}