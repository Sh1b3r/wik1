// Шляхи в даних зберігаються відносно public/ ("images/..."),
// а BASE_URL у продакшені дорівнює "/wik1/", тож конкатенуємо тут.
export function assetUrl(path) {
    return import.meta.env.BASE_URL + path
}
