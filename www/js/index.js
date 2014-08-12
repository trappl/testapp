/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.addEventListener("backbutton", function() {
            var evt = document.createEvent("Events");
            evt.initEvent('touchend', true, true);
            document.getElementById("buttonzurueck").dispatchEvent(evt);
        }, false);
        renderIndex();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        if (parentElement !== null) {
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            console.log('Received Event: ' + id);
        }
    }

};


// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccess = function(position) {
    navigator.notification.alert('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n', function() {
            }, "Ergebnis", "Ok");
    document.getElementById("load").style.setProperty("opacity", "0.0");
};

// onError Callback receives a PositionError object
//
function onError(error) {
    navigator.notification.alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n', function() {
            }, "Fehlermeldung", "Ok");
    document.getElementById("load").style.setProperty("opacity", "0.0");
}

function showPosition() {
    document.getElementById("load").style.setProperty("opacity", "1.0");
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
}

function onSuccessPhoto(imageData) {
    var image = document.getElementById('myImage');
    image.setAttribute("src", "data:image/jpeg;base64," + imageData);
}

function onFail(message) {
    navigator.notification.alert('Failed because: ' + message, function() {
    }, "Fehlermeldung", "Ok");
}

function takePhoto() {
    navigator.camera.getPicture(onSuccessPhoto, onFail, {quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function erfassePosition() {
    document.getElementById("load").style.setProperty("opacity", "1.0");
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = document.getElementById('lat');
        var lon = document.getElementById('lon');
        lat.setAttribute("value", position.coords.latitude);
        lon.setAttribute("value", position.coords.longitude);
        document.getElementById("load").style.setProperty("opacity", "0.0");
    }, onError);
}

function scanBarcode() {
    cordova.plugins.barcodeScanner.scan(
            function(result) {
                navigator.notification.alert("We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled, function() {
                        }, "Ergebnis", "Ok");
            },
            function(error) {
                navigator.notification.alert("Scanning failed: " + error, function() {
                }, "Fehlermeldung", "Ok");
            }
    );
}

function absenden() {
    var bezeichnung = document.getElementById("bezeichnung");
    var typ = document.getElementById("typ");
    var lon = document.getElementById("lon");
    var lat = document.getElementById("lat");

    navigator.notification.alert("Bezeichnung: " + bezeichnung.value + "\n"
            + "Typ: " + typ.options[typ.selectedIndex].text + "\n"
            + "Longitude: " + lon.value + "\n"
            + "Latitude: " + lat.value, function() {
                renderIndex();
            }, "Daten", "Ok");   
}

function ladeSeite() {
    document.getElementById("load").style.setProperty("opacity", "1.0");
    $.ajax({
        url: 'http://www.lj-altenburg.at/php/log.php',
        type: 'GET',
        success: function(data) {
            navigator.notification.alert(data, function() {
            }, "Ergebnis", "Ok");
            document.getElementById("load").style.setProperty("opacity", "0.0");
        }
    });
}

function showMenue() {
    navigator.notification.alert(unescape('Men%FC ist noch nicht implementiert'), function() {
    }, unescape("Men%FC"), "Ok");
}

function renderIndex() {
    var html =
            "<div class='top'>" +
            "<img id='load' src='img/load.gif'/>" +
            "</div>" +
            "<div class='app'>" +
            "<button class='button' id='buttongeintragen'>Ger%E4t eintragen</button>" +
            "<button class='button' id='buttonseite2'>Testseite</button>" +
            "</div>" +
            "<div class='bottom'>" +
            "<button class='element' id='buttonzurueck' style='opacity: 0.0;'>XX</button>" +
            "<button class='element' id='buttonmenue'>Men%FC</button>" +
            "</div>";
    if (navigator.appVersion.indexOf("Win") != -1) {
        $('body').html(window.toStaticHTML(unescape(html)));
        $('#buttongeintragen').click(function() {
            renderEintragen();
        });
        $('#buttonseite2').click(function() {
            renderSeite2();
        });
        $('#buttonmenue').click(function() {
            showMenue();
        });
    } else {
        $('body').html(unescape(html));
        document.getElementById("buttonzurueck").addEventListener("touchend", function() {
            navigator.app.exitApp();
        });
        document.getElementById("buttongeintragen").addEventListener("touchend", function() {
            renderEintragen();
        });
        document.getElementById("buttonseite2").addEventListener("touchend", function() {
            renderSeite2();
        });
        document.getElementById("buttonmenue").addEventListener("touchend", function() {
            showMenue();
        });
    }
}

function renderEintragen() {
    var html =
            "<div class='top'>" +
            "<img id='load' src='img/load.gif'/>" +
            "</div>" +
            "<div class='app'>" +
            "Bezeichnung:<br />" +
            "<input type='text' name='bezeichnung' class='input' id='bezeichnung'/><br />" +
            "Typ:<br />" +
            "<select name='typ' class='input' id='typ'>" +
            "<option>Typ1</option>" +
            "<option>Typ2</option>" +
            "<option>Typ3</option>" +
            "<option>Typ4</option>" +
            "<option>Typ5</option>" +
            "</select><br />" +
            "<h1>Position:</h1><br />" +
            "Lon.:<br />" +
            "<input type='number' name='lon' class='input' id='lon'/><br />" +
            "Lat.:<br />" +
            "<input type='number' name='lat' class='input' id='lat'/><br />" +
            "<button class='button' id='buttonerfasseP'>akt. Position erfassen</button>" +
            "<br />" +
            "<button id='buttonabsenden' class='button'>absenden</button>" +
            "</div>" +
            "<div class='bottom'>" +
            "<button class='element' id='buttonzurueck'>zur%FCck</button>" +
            "<button class='element' id='buttonmenue'>Men%FC</button>" +
            "</div>";
    if (navigator.appVersion.indexOf("Win") != -1) {
        $('body').html(window.toStaticHTML(unescape(html)));
        $('#buttonerfasseP').click(function() {
            erfassePosition();
        });
        $('#buttonabsenden').click(function() {
            absenden();
        });
        $('#buttonzurueck').click(function() {
            renderIndex();
        });
        $('#buttonmenue').click(function() {
            showMenue();
        });
    } else {
        $('body').html(unescape(html));
        document.getElementById("buttonerfasseP").addEventListener("touchend", function() {
            erfassePosition();
        });
        document.getElementById("buttonabsenden").addEventListener("touchend", function() {
            absenden();
        });
        document.getElementById("buttonzurueck").addEventListener("touchend", function() {
            renderIndex();
        });
        document.getElementById("buttonmenue").addEventListener("touchend", function() {
            showMenue();
        });
    }
}

function renderSeite2() {
    var html =
            "<div class='top'>" +
            "<img id='load' src='img/load.gif'/>" +
            "</div>" +
            "<div class='app'>" +
            "<img class='bild' id='myImage' src='img/logo.png'/>" +
            "<button class='button' id='buttonshowP'>show Position</button>" +
            "<button class='button' id='buttontakeP'>take Photo</button>" +
            "<button class='button' id='buttonscanB'>Scan Barcode</button>" +
            "<button class='button' id='buttonladeS'>Seite laden</button>" +
            "</div>" +
            "<div class='bottom'>" +
            "<button class='element' id='buttonzurueck'>zur%FCck</button>" +
            "<button class='element' id='buttonmenue'>Men%FC</button>" +
            "</div>";
    if (navigator.appVersion.indexOf("Win") != -1) {
        $('body').html(window.toStaticHTML(unescape(html)));
        $('#buttonshowP').click(function() {
            showPosition();
        });
        $('#buttontakeP').click(function() {
            takePhoto();
        });
        $('#buttonscanB').click(function() {
            scanBarcode();
        });
        $('#buttonladeS').click(function() {
            ladeSeite();
        });
        $('#buttonzurueck').click(function() {
            renderIndex();
        });
        $('#buttonmenue').click(function() {
            showMenue();
        });
    } else {
        $('body').html(unescape(html));
        document.getElementById("buttonshowP").addEventListener("touchend", function() {
            showPosition();
        });
        document.getElementById("buttontakeP").addEventListener("touchend", function() {
            takePhoto();
        });
        document.getElementById("buttonscanB").addEventListener("touchend", function() {
            scanBarcode();
        });
        document.getElementById("buttonladeS").addEventListener("touchend", function() {
            ladeSeite();
        });
        document.getElementById("buttonzurueck").addEventListener("touchend", function() {
            renderIndex();
        });
        document.getElementById("buttonmenue").addEventListener("touchend", function() {
            showMenue();
        });
    }
}