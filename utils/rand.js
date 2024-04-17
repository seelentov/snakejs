const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export default rand