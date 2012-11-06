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

    var updateLocations = function(callback) {
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

    var outLocations = function() {

        $('.locations .count').html(locations.length);
        $('select[name=location_id], .locations .location').empty();

        $.each(locations, function(idx, l) {
            var activeCls = parseInt(l.id) === currentLocationId ? 'active' : '';
            $('.locations li:last').before('<li class="location '+activeCls+'"><a href="#"><span class="tab action" data-id="'+l.id+'">'+l.title+' ('+l.address+')</span>&nbsp;&nbsp;<span class="icon-edit pull-right action"></span></a></li>');
            $('select[name=location_id]').append('<option value="'+l.id+'">'+l.title+' ('+l.address+')</option>');
        });
    }


    outLocations();
    outDevices(locations[0].devices);


    // redraw devices section
    $('.locations .location .tab').live('click', function(e) {
        //console.log('tab click!', this);
        e.preventDefault();
        currentLocationId = parseInt($(this).attr('data-id'));

        var devices = getDevices(currentLocationId);
        if (devices === false) {
            $.stickr({note:'no such location!', className:'classic error', sticked:true});
        } else {
            $('.locations .location').removeClass('active');
            $(this).parents('.location').addClass('active');                        
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
    $('.popup.editLocation').dialog({
        "autoOpen":false,
        "draggable":false,
        "modal":true,
        "resizable":false,
        "title":"Редактировать локацию"
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


    // create location popup
    $('#addLocationBtn').click(function(e) {
        e.preventDefault();        
        $('.popup.addLocation').dialog("open");
    });
    // post location
    $('.addLocation form').on('submit', function(e) {
        e.preventDefault();
        var title = $('.addLocation input[name=title]').val();
        var address = $('.addLocation input[name=address]').val();
        var form = this;

        $.ajax({
            'url': '/api/v1/locations',
            'type': 'POST',
            'data': $(this).serialize(),
            'success': function(data) {
                if (data.success) {
                    form.reset();
                    updateLocations(function() {
                        outLocations();
                        $.stickr({note:'Локация '+title+' добавлена', className:'classic'})
                    });
                } else {
                    $.stickr({note:data.message, className:'classic error', sticked:true});
                }

                $('.popup.addLocation').dialog('close');
            }
        });
    });
    // editLocation popup
    $('.locations .icon-edit').live('click', function(e) {
        e.preventDefault();
        var locationId = $(this).siblings('.tab').attr('data-id');
        var location;

        for (var i in locations) {
            if (locations[i].id === locationId) {
                location = locations[i];
            }
        }

        $(".editLocation input[name=title]").val(location.title);
        $(".editLocation input[name=address]").val(location.address);
        $(".editLocation input[name=location_id]").val(location.id);

        $('.popup.editLocation').dialog("open");
    });
    // put location
    $('.editLocation form').on('submit', function(e) {
        e.preventDefault();
        var id = $('.editLocation input[name=location_id]').val();
        var title = $('.editLocation input[name=title]').val();
        var address = $('.editLocation input[name=address]').val();
        var form = this;

        $.ajax({
            'url': '/api/v1/locations/'+id,
            'type': 'POST',
            'data': $(this).serialize(),
            'headers': {
                'X-HTTP-Method-Override':'PUT'
            }, 'success': function(data) {
                if (data.success) {
                    form.reset();
                    updateLocations(function() {                    
                        outLocations();
                        $.stickr({note:'Локация '+title+' обновлена', className:'classic'});
                    });
                } else {
                    $.stickr({note:data.message, className:'classic error', sticked:true});
                }

                $('.popup.editLocation').dialog('close');
            }
        });
    });
    // delete location
    $('.editLocation button[name=delete]').on('click', function(e) {
        e.preventDefault();
        var title = $('.editLocation input[name=title]').val();
        var locationId = $('.editLocation input[name=location_id]').val();
        var form = this;

        $.ajax({
            'url': '/api/v1/locations/'+locationId,
            'type': 'POST',
            'headers': {
                'X-HTTP-Method-Override':'DELETE'
            }, 'success': function(data) {
                if (data.success) {
                    updateLocations(function() {                    
                        if (currentLocationId === locationId) {
                            currentLocationId = parseInt(locations[0].id);
                        }
                        outLocations();
                        $.stickr({note:'Локация '+title+' удалена!', className:'classic'})
                    });
                } else {
                    $.stickr({note:data.message, className:'classic error', sticked:true});
                }

                $('.popup.editLocation').dialog('close');                
            }
        });
    });



    // create device popup
    $('#addDeviceBtn').click(function(e) {
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
        var deviceTitle = $('.addDevice input[name=title]').val();
        var deviceNum = $('.addDevice input[name=num]').val();
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
                        $.stickr({note:'Оборудование '+deviceTitle+' добавлено', className:'classic'});
                    });
                } else {
                    $.stickr({note:data.message, className:'classic error', sticked:true});
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
                        $.stickr({note:'Оборудование '+deviceTitle+' обновлено',className:'classic'});                       
                    });
                } else {
                    $.stickr({note:data.message, className:'classic error', sticked:true});
                }

                $('.popup.editDevice').dialog('close');
            }
        });
    });
    // delete device
    $('.editDevice button[name=delete]').on('click', function(e) {
        e.preventDefault();
        var deviceTitle = $('.editDevice input[name=title]').val();
        var deviceId = $('.editDevice input[name=device_id]').val();
        var form = $('.editDevice form').get(0);

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
                        $.stickr({note:'Оборудование '+deviceTitle+' удалено!', className:'classic'});
                    });
                } else {
                    $.stickr({note:data.message, className:'classic error', sticked:true});
                }

                $('.popup.editDevice').dialog('close');                
            }
        });
    });

    $.ajaxSetup({
        'dataType': 'json',
        //'contentType': 'application/json',
        'error': function(xhr) {
            $.stickr({note:xhr.status + ' ' + xhr.statusText, className:'classic error', sticked:true});
        }
    });

});