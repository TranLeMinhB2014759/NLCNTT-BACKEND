class Regex {
    static email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    static phoneNumber = /^(09|03|07|08|05|01)[0-9]{8}$/;
    static number = /^[0-9]+$/;
    static code = /^[A-Z]\d{1,3}(\.\d{1,3})?$/;
}

module.exports = Regex;