$(function() {
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

    var outDevices = function(devices) {        
        $('.devices .count').html(devices.length);
        $.each(devices, function(idx, d) {
            $('.devices .nav-header').after('<li class="device"><a href="#" data-id="'+d.id+'">'+d.title+' ('+d.num+')</a></li>')
        });
    }

    // locations
    $('.locations .count').html(locations.length);
    $.each(locations, function(idx, l) {
        $('.locations li:last').before('<li class="location"><a href="#" data-id="'+l.id+'">'+l.title+' ('+l.address+')</a></li>');        
    });
    $('.locations li:eq(1)').addClass('active');

    // devices
    outDevices(locations[0].devices);


    $('.locations .location a').click(function(e) {        
        e.preventDefault();
        var id = parseInt($(this).attr('data-id'));
        var devices = [];

        $('.locations li').removeClass('active');
        $(this).parent('li').addClass('active');

        for (var idx in locations) {
            var location = locations[idx];
            //console.log(typeof location.id, typeof id);
            if (location.id === id) {
                //console.log(location);
                devices = location.devices;
                //console.log(location);
                break;
            }
        }

        //console.log($('.devices .device'));
        $('.devices .device').remove();
        //console.log($('.devices .device'));
        outDevices(devices);
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

    $('.locations .btn').click(function(e) {
        e.preventDefault();
        $('.popup.addLocation').dialog("open");
    });

    $('.devices .btn').click(function(e) {
        e.preventDefault();
        $('.popup.addDevice').dialog("open");
    });

    /*
    $('.popup.addLocation form').submit(function(e) {
        e.preventDefault();

        $.post($(this).attr('action'), {})
    })
    */

});