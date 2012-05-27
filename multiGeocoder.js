/**
 * @fileOwerview
 * Пример реализации функциональности множественного геокодирования.
 * Аналогичная разработка для первой версии АПИ.
 * @see http://api.yandex.ru/maps/doc/jsapi/1.x/examples/multiplygeocoding.html
 * @example
 * var multiGeocoder = new MultiplyGeocoder({ boundedBy : map.getBounds() });
 * multiGeocoder
 *     .geocode(['Москва, Льва Толстого 16', [55.7, 37.5], 'Санкт-Петербург'])
 *         .then(
 *             function (res) {
 *                 map.geoObjects.add(res.geoObjects);
 *             },
 *             function (err) {
 *                 console.log(err);
 *             }
 *         );
 */

/**
 * Класс для геокодирования списка адресов или координат.
 * @class
 * @name MultiplyGeocoder
 * @param {Object} [options={}] Дефолтные опции мультигеокодера.
 */
function MultiplyGeocoder(options) {
    this._options = options || {};
};

/**
 * Функция множественнеого геокодирования.
 * @function
 * @requires ymaps.util.extend
 * @see http://api.yandex.ru/maps/doc/jsapi/2.x/ref/reference/util.extend.xml
 * @requires ymaps.util.Promise
 * @see http://api.yandex.ru/maps/doc/jsapi/2.x/ref/reference/util.Promise.xml
 * @name MultiplyGeocoder.geocode
 * @param {Array} requests Массив строк-имен топонимов и/или геометрий точек (обратное геокодирование)
 * @returns {Object} Как и в обычном геокодере, вернем объект-обещание.
 */
MultiplyGeocoder.prototype.geocode = function (requests, options) {
    var size = requests.length,
        promise = new ymaps.util.Promise(),
        options = options && ymaps.util.extend({}, this._options, options) || this._options,
        result = {
            geoObjects : new ymaps.GeoObjectArray()
        };

    requests.forEach(function (request, index) {
        ymaps.geocode(request, options)
            .then(
                function (response) {
                    var geoObject = response.geoObjects.get(0);

                    geoObject && result.geoObjects.add(geoObject, index);
                    --size || promise.resolve(result);
                },
                function (err) {
                    promise.reject(err);
                }
            );
    }, this);

    return promise;
};

