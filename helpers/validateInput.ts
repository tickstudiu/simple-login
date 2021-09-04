export const validateNumber = (event: any) => {
    const regex = /^\d+$/
    if (!regex.test(event.key)) {
        event.preventDefault()
    }
}

export default {}
