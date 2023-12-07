export function generatePassword() {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const symbol = '!@#$%^&*()-_=+[{]}|;:,<.>/?';
    const number = '0123456789';

    const low = lowercase[Math.floor(Math.random() * lowercase.length)];
    const upp = uppercase[Math.floor(Math.random() * uppercase.length)];
    const symb = symbol[Math.floor(Math.random() * symbol.length)];
    const numb = number[Math.floor(Math.random() * number.length)];

    const rest = lowercase + uppercase + symbol + numb;

    let password = low + upp + symb + numb;
    for (let i = 0; i < 12 - 3; i++) {
        const randomCaract = rest[Math.floor(Math.random() * rest.length)];
        password += randomCaract;
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
}
