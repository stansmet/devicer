$(function() {
    /*
    var locations = [
        {"id":1, "title":"БВИ", "address":"Аврора парк", "devices":[
            { "id":1, "title":"роутер", "num":"123123d" }
        ]},
        {"id":2, "title":"МПx", "address":"Молодежная", "devices":[
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":3, "title":"системник", "num":"123123f" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" },
            { "id":2, "title":"монитор", "num":"123556e" }
        ]}
    ];
    */

    var updateLocations = function(callback = undefined) {
        $.get('/locations', function(data) {
            locations = data;

            if (callback != undefined) {
                callback(data);
            }
        });
    }

    var outDevices = function(devices) {        
        $('.devices .count').html(devices.length);
        $('.devices .device').remove();
        $.each(devices, function(idx, d) {
            $('.devices .nav-header').after('<li class="device"><a href="#" data-id="'+d.id+'">'+d.title+' ('+d.num+')</a></li>')
        });
    }

    var getDevices = function(locationId) {
        for (var idx in locations) {
            var location = locations[idx];

            if (parseInt(location.id) === locationId) {
                return location.devices;
            }
        }

        return false;
    }

    // locations
    $('.locations .count').html(locations.length);
    $.each(locations, function(idx, l) {
        $('.locations li:last').before('<li class="location"><a href="#" data-id="'+l.id+'">'+l.title+' ('+l.address+')</a></li>');        
    });
    $('.locations li:eq(1)').addClass('active');

    // devices
    outDevices(locations[0].devices);

    // redraw devices section
    $('.locations .location a').click(function(e) {        
        e.preventDefault();
        currentLocationId = parseInt($(this).attr('data-id'));

        var devices = getDevices(currentLocationId);
        if (devices === false) {
            alert('no such location!');
        } else {
            $('.locations li').removeClass('active');
            $(this).parent('li').addClass('active');                        
            outDevices(devices);
        }
    });

    $('.popup.addLocation').dialog({
        "autoOpen":false,
        "draggable":false,
        "modal":true,
        "resizable":false,
        "title":"Добавить локацию"
    });
    $('.popup.addDevice').dialog({
        "autoOpen":false,
        "draggable":false,
        "modal":true,
        "resizable":false,
        "title":"Добавить оборудование"
    });
    $('.popup.editDevice').dialog({
        "autoOpen":false,
        "draggable":false,
        "modal":true,
        "resizable":false,
        "title":"Редактировать оборудование"
    });

    $('.locations .btn').click(function(e) {
        e.preventDefault();
        $('.popup.addLocation').dialog("open");
    });



    // create device popup
    $('.devices .btn').click(function(e) {
        e.preventDefault();

        $('.addDevice select[name=location_id] option').each(function(idx, el) {
            if (parseInt($(el).val()) === currentLocationId) {
                $(el).attr('selected', 'selected');
            } 
        });

        $('.popup.addDevice').dialog("open");
    });

    // post device
    $('.addDevice form').on('submit', function(e) {
        e.preventDefault();
        var deviceTitle = $('.editDevice input[name=title]').val();
        var deviceNum = $('.editDevice input[name=num]').val();
        var locationId = parseInt($('.editDevice select[name=location_id]').val());
        var form = this;

        $.ajax({
            'url': '/api/v1/devices',
            'type': 'POST',
            'data': $(this).serialize(),
            'success': function(data) {
                if (data.success) {
                    form.reset();
                    updateLocations(function() {
                        outDevices(getDevices(currentLocationId));                        
                    });
                } else {
                    alert(data.message);
                }

                $('.popup.addDevice').dialog('close');
            }
        });
    });

    // editDevice popup
    $('.devices .device a').live('click', function(e) {
        e.preventDefault();
        var deviceId = $(this).attr('data-id');
        var device;

        for (var i in locations) {
            var l = locations[i];
            for (var j in l.devices) {
                if (l.devices[j].id === deviceId) {
                    device = l.devices[j];
                }
            }
        }

        $('.editDevice select[name=location_id] option').each(function(idx, el) {
            if ($(el).val() === device.location_id) {                
                $(el).attr('selected', 'selected');
            } 
        });

        $(".editDevice input[name=title]").val(device.title);
        $(".editDevice input[name=num]").val(device.num);
        $(".editDevice input[name=device_id]").val(device.id);

        $('.popup.editDevice').dialog("open");
    });


    // put device
    $('.editDevice form').on('submit', function(e) {
        e.preventDefault();
        var deviceId = $('.editDevice input[name=device_id]').val();
        var deviceTitle = $('.editDevice input[name=title]').val();
        var deviceNum = $('.editDevice input[name=num]').val();
        var locationId = parseInt($('.editDevice select[name=location_id]').val());
        var form = this;

        $.ajax({
            'url': '/api/v1/devices/'+deviceId,
            'type': 'POST',
            'data': $(this).serialize(),
            'headers': {
                'X-HTTP-Method-Override':'PUT'
            }, 'success': function(data) {
                if (data.success) {
                    form.reset();
                    updateLocations(function() {
                        outDevices(getDevices(currentLocationId));                        
                    });
                } else {
                    alert(data.message);
                }

                $('.popup.editDevice').dialog('close');
            }
        });
    });


    // delete device
    $('.editDevice button[name=delete]').on('click', function(e) {
        e.preventDefault();
        var deviceId = $('.editDevice input[name=device_id]').val();
        var form = this;

        $.ajax({
            'url': '/api/v1/devices/'+deviceId,
            'type': 'POST',
            'headers': {
                'X-HTTP-Method-Override':'DELETE'
            }, 'success': function(data) {
                if (data.success) {
                    form.reset();
                    updateLocations(function() {
                        outDevices(getDevices(currentLocationId));                        
                    });
                } else {
                    alert(data.message);
                }

                $('.popup.editDevice').dialog('close');                
            }
        });
    });

    $.ajaxSetup({
        'dataType': 'json',
        //'contentType': 'application/json',
        'error': function(xhr) {
            alert(xhr.status + ' ' + xhr.statusText);
        }
    });

});