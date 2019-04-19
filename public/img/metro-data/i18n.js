/*global ymaps */
ymaps.ready(function () {
    var TARGET_LANG = ['uk-UA', 'be-BY', 'en-US', 'tr-TR'],
        METRO_REGEXP = /\s*(метро|metro)\s*/i,
        LINE_METRO_REGEXP = /\s*(метро|metro|линия|лінія|liniya)\s*/ig,
        SCHEME_IDS = [1, 13, 2, 8, 9];

    function getHttp(url) {
        var domParser, node,
        xhr = new XMLHttpRequest(),
        deferred = new ymaps.vow.Deferred();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                deferred.resolve(xhr.responseText);
            }
        };
        xhr.onerror = function (e) {
            deferred.reject(e);
        };
        xhr.open('GET', url, true);
        xhr.send(null);

        return deferred.promise();
    }
    function capitalize(str) {
        return str.split(' ').map(function (word) {
            return word[0].toUpperCase() + word.substr(1);
        }).join(' ');
    }
    function createDownloadButton(svgText, label) {
        var anchor = document.createElement('a');
        anchor.setAttribute('download', label);
        anchor.setAttribute('href', 'data:image/svg+xml,' + svgText);
        anchor.textContent = label;

        return anchor;
    }
    function getSVG(id) {
        return getHttp(id + '.ru.svg').then(function (responseText) {
            return (new DOMParser()).parseFromString(responseText, "text/xml");
        });
    }
    function getMetadata(svg) {
        var metadataNode = svg.getElementsByTagName('metadata')[0];

        return JSON.parse(metadataNode.firstChild.data);
    }
    function setMetadata(svg, metadata) {
        var metadataNode = svg.getElementsByTagName('metadata')[0];

        metadataNode.innerHTML = '<![CDATA[' + JSON.stringify(metadata) + ']]>';
    }
    function getSpn(geoobject) {
        var Envelope = geoobject.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope,
            lowerCorner = Envelope.lowerCorner.split(' '),
            upperCorner = Envelope.upperCorner.split(' ');

        return [
            upperCorner[0] - lowerCorner[0],
            upperCorner[1] - lowerCorner[1]
        ];
    }
    function getLl(geoobject) {
        var pos = geoobject.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;

        return pos.split(' ');
    }
    function updateLabelText(svg, labelId, text) {
        var labelNode = svg.getElementById('label-' + labelId),
            textNode = labelNode.getElementsByTagName('text')[0],
            tspans = textNode.querySelectorAll('tspan'),
            tokens, i;

        if (tspans.length) {
            tokens = text.split(/\s|(-)/).filter(Boolean);
            tokens = tokens.reduce(function (memo, token) {
                if (token === '-') {
                    memo[memo.length - 1] += token;
                } else {
                    memo.push(token);
                }
                return memo;
            }, []);
            console.log(text, tokens, tspans.length);
            for (i = 0; i < tspans.length - 1; i++) {
                tspans[i].innerHTML = tokens[i];
            }
            //todo '-'
            console.log(i, tokens.slice(i).join(' '));
            tspans[i].innerHTML = tokens.slice(i).join(' ');
        } else {
            textNode.innerHTML = text;
        }
    }
    function translate(svg, lang, id) {
        var metadata,
            url = [
                'http://geocode-maps.yandex.ru/1.x/',
                '?format=json',
                '&lang=' + lang,
                '&results=1'
            ].join('');

        svg  = svg.cloneNode(true);
        metadata = getMetadata(svg);
        metadata.locale = lang.split('-')[0];

        return getHttp(url + '&geocode=' + metadata.name + '&kind=locality').then(function (data) {
            var cityGeoobject = JSON.parse(data).response;

            return Object.keys(metadata.stations).reduce(function (chain, id, idx) {
                return chain.then(function () {
                    var station = metadata.stations[id];
                    return getHttp([
                        url,
                        '&geocode=метро ' + station.name,
                        '&kind=metro',
                        '&lang=' + lang,
                        '&ll=' + getLl(cityGeoobject),
                        '&rspn=1',
                        '&results=1',
                        '&spn=' + getSpn(cityGeoobject)
                    ].join('')).then(function (data) {
                        var response = JSON.parse(data).response,
                            geoobject = response.GeoObjectCollection.featureMember[0].GeoObject,
                            area = geoobject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea,
                            locality = area.Locality || area.SubAdministrativeArea.Locality,
                            lineName;

                        if (locality.DependentLocality) {
                            lineName = locality.DependentLocality.Thoroughfare.ThoroughfareName;
                        } else {
                            lineName = locality.Thoroughfare.ThoroughfareName;
                        }
                        metadata.lines[station.lineId].name = lineName.replace(LINE_METRO_REGEXP, '');
                        station.name = geoobject.name.replace(METRO_REGEXP, '');

                        updateLabelText(svg, station.labelId, station.name);
                        console.log(((100 * idx / Object.keys(metadata.stations).length) | 0) + '%');
                    });
                });
            }, ymaps.vow.fulfill()).then(function () {
                svg.querySelector('locale').innerHTML = metadata.locale;
                setMetadata(svg, metadata);
                document.body.appendChild(createDownloadButton(
                    (new XMLSerializer()).serializeToString(svg),
                    [id, metadata.locale, 'svg'].join('.')
                ));
            });
        });
    }
    // return getSVG(9).then(function (svg) {
        // return translate(svg, 'be-BY', 9);
    // }).done();

    TARGET_LANG.reduce(function (chain, lang) {
        return chain.then(function () {
            return SCHEME_IDS.reduce(function (subchain, id) {
                return subchain.then(function () {
                    return getSVG(id).then(function (svg) {
                        return translate(svg, lang, id);
                    });
                });
            }, ymaps.vow.fulfill());
        });
    }, ymaps.vow.fulfill()).done();
});
