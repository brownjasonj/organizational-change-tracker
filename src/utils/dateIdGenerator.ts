const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')
const dateIdGenerator = (date: Date): string => {
    return `${date.getUTCFullYear()}${zeroPad(date.getUTCMonth()+1, 2)}${zeroPad(date.getUTCDate(), 2)}${zeroPad(date.getUTCHours(), 2)}${zeroPad(date.getUTCMinutes(), 2)}${zeroPad(date.getUTCSeconds(), 2)}`
}

export { dateIdGenerator }