import validationKey from '@/enums/validationKey'

export default (errorField: string) => {
    // TODO: add i18n here
    switch (errorField) {
        case validationKey.REQUIRED:
            return 'กรุณากรอกข้อมูล'
        case validationKey.MAX_LENGTH:
            return 'ตัวอักษรเกินที่กำหนดไว้'
        default:
            return null
    }
}
