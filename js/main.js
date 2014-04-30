$(function(){

var $board = $('.board'),
    setShortLink = function (href) {
        var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            string = '',
            charCnt = 20,
            uri;
        for (var i = 0; i < charCnt; i += 1) {
            string += characters[Math.floor(Math.random() * characters.length)];
        }
        // uri = 'http://tinyurl.com/create.php?source=indexpage&url=' + encodeURIComponent(href) + '&alias=' + string;
        // $('body').append('<img src="' + uri + '" style="height: 1px; width: 1px; position: absolute; z-index: -999; opacity: 0;" />');
        // $('#shortlink').html('http://tinyurl.com/' + string);
    },
    setBoard = function (conf) {
        console.log('set board');
        var value,
            htmlString = '';
        $.each(conf.ironThroneOrder, function (index, house) {

            if(conf.controlledLands[house] !== undefined) {
                var orderHtml = '';

                $.each(conf.orders[house], function (orderToken, orderLand) {
                    orderHtml += '<div class="ordera-select-' + orderToken + ' order">';
                    orderHtml += '<label>'+conf.orderTokens[orderToken] +'</label>';
                    orderHtml += '<select name="'+ house +'-order-token" data-house="'+ house +'" data-token="'+orderToken+'" class="token">';
                    orderHtml += '<option value="">---</option>';

                    $.each(conf.controlledLands[house], function (landIndex, landName) {
                        if(landName !== undefined) {
                            var selected = '';
                            if(orderLand === landName.land) {
                                selected = 'selected';
                            }
                            orderHtml += '<option value="'+ landName.land +'" ' + selected + '>'+ landName.land +'</option>';
                        }
                    });
                    orderHtml += '</select>';
                    orderHtml += '</div>';
                });
            }
            $('.'+ house +'-controls .orders').html(orderHtml);
             var unitHtml = '';
            //sort
            conf.lands.sort(function(a, b) {
                var textA = a.land.toUpperCase();
                var textB = b.land.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });


            unitHtml += '<select name="'+house+'-new-unit-land" class="land"><option value="">---</option>';
            $.each(conf.lands, function (landIndex, land){
                unitHtml += '<option value="'+ land.land +'">'+ land.land +'</option>';
            });
            unitHtml += '</select>';
            unitHtml += '<select name="'+house+'-new-unit-rank" class="unitRank"><option value="">---</option>';
            $.each(conf.units, function (unit, value) {
                unitHtml += '<option value="'+ unit +'">'+ unit +'</option>';
            });
            unitHtml += '</select>';
            $('.'+house+'-controls .newUnit').html(unitHtml);
        });



        // wildling token
        htmlString += '<div class="wildlingmarker pos-wilding-' + conf.wildlings + '"></div>';
        // round token
        htmlString += '<div class="round pos-round-' + conf.round + '"></div>';
        // Influence Tracks
        // Iron Throne
        $.each(conf.ironThroneOrder, function (place, house) {
              htmlString += '<div class="token-' + house + ' pos-throne-' + place + '"></div>';
        });

        // Fiefdom
        $.each(conf.fiefdomOrder, function (place, house) {
            htmlString += '<div class="token-' + house + ' pos-fiefdom-' + place + '"></div>';
        });

        // King's Court
        $.each(conf.kingsCourtOrder, function (place, house) {
            htmlString += '<div class="token-' + house + ' pos-court-' + place + '"></div>';
        });

        // Supply
        $.each(conf.supply, function (house, supply) {
            htmlString += '<div class="supply-' + house + ' pos-supply-' + supply + '"></div>';
        });
        // Victory
        $.each(conf.victory, function (house, points) {
            htmlString += '<div class="victory-' + house + ' pos-victory-' + points + '"></div>';
        });
        // Garrisons
        $.each(conf.garrisons, function (house, garrison) {
            htmlString += '<div class="garrison pos-' + house + '" data-value="' + garrison + '"></div>';
        });
        // VSB and Raven token
        // conf.vsbUsed = true;
        // console.log(conf.vsbUsed);
        // console.log('<div class="vsb-token ' + (conf.vsbUsed ? 'used' : 'unused') + '"></div>');

        htmlString += '<div data-path="vsbUsed" data-value="'+conf.vsbUsed+'" class="switch vsb-token ' + (conf.vsbUsed === "true" ? 'used' : 'unused') + '"></div>';
        htmlString += '<div data-path="ravenUsed" data-value="'+conf.ravenUsed+'"  class="switch raven-token ' + (conf.ravenUsed === "true" ? 'used' : 'unused') + '"></div>';
        // Units

        $.each(conf.controlledLands, function (houseIndex, house) {
            //is house alive?
            if(house !== undefined) {
                $.each(house, function (landIndex, land) {
                    $.each(land.units, function (unit, count) {
                        if(count > 0) {
                            htmlString += '<div data-land="' + land.land + '" data-house="' + houseIndex + '" data-unit="' + unit + '" class="' + unit + '-' + houseIndex + ' pos-' + land.land + ' unit"><div class="remove"></div></div>';
                        }
                    });
                });
            }
        });

        $.each(conf.orders, function (houseIndex, house) {
            $.each(house, function (order, land) {
                if(land !== '0') {
                    htmlString += '<div class="order-' + order + ' pos-' + land + '"></div>';
                }
            });
        });

        $.each(conf.powertokens, function (house, count) {
            htmlString += '<div class="tokenCounts-' + house + ' powertoken-' + house + '">';
            // available Power Tokens
            htmlString += '<div class="availablePowertokens" data-house="'+ house + '" data-tokens="'+count+'">';
            htmlString += count
            htmlString += '</div>';
            // left Power Tokens
            htmlString += '<div class="leftPowertokens" data-house="'+ house + '" data-tokens="'+count+'">';
            htmlString += conf.maxPowertokens - count;
            htmlString += '</div>';
            htmlString += '</div>';
        });

        $.each(conf.housecards, function (houseIndex, house) {
            $.each(house, function (cardIndex, card) {
                if(card.used == 'true') {
                    $('input[name="housecard-' + cardIndex + '-' + houseIndex + '"]').attr('checked', true);
                }
            });
        });

        $('.maxPowertokens').val(conf.maxPowertokens);


        $(':not(input)', $board).remove();
        $(htmlString).appendTo($board);
    };

// inital setting of the board
// try {
    var hash = location.hash;
    if (hash.indexOf('#') === 0) {
        hash = hash.substr(1);
        currentConf = $.deparam(hash);
    }
    setBoard(currentConf);
// } catch (e) {
//     console.log(e);
// };

//Text list
$('.text-list').on('focusout', function (event) {
    var itemList = $(event.delegateTarget).find('.list');
    var items = itemList.val().split('\n');
    var path = itemList.data('path');

    var list = {};
    $.each(items, function (index, item) {
        list[index+1] = item.toLowerCase();
    });

    currentConf[path] = list;
    location.hash = $.param(currentConf);

});

$('input[type=number]').bind('keyup mouseup', function (event) {
    var path = $(this).data('path');
    currentConf[path] = $(this).val();
    location.hash = $.param(currentConf);
});

$('input[type=checkbox]').on('change', function (event) {
    var value = $(this).is(":checked") ? true : false;
    var path = $(this).data('path');
    currentConf[path] = value;
    location.hash = $.param(currentConf);
});

$('body').on('click', '.switch', function (event) {
    var value = !$(this).data('value');
    var path = $(this).data('path');

    currentConf[path] = value;
    location.hash = $.param(currentConf);
});


//Limited add
$('.settings-container').on('change', '.token', function (event) {
    // console.log(event);
    var land = event.target.value;
    var token = $(event.currentTarget).data('token');
    var house = $(event.currentTarget).data('house');

    $.each(currentConf.orders[house], function (tokenName, landName) {
        if(land == landName) {
            currentConf.orders[house][tokenName] = 0;
        }
    });
    currentConf.orders[house][token] = land;
    location.hash = $.param(currentConf);

});

$('body').on('click', '.unit', function (element) {
    var house = $(this).data('house');
    var unit = $(this).data('unit');
    var land = $(this).data('land');

    $.each(currentConf.controlledLands, function (houseIndex, house) {
        for(var i = house.length-1; i >= 0; i -= 1) {

            if(house[i].land === land) {
                house[i].units[unit]--;
            }
            var units = 0;
            $.each(currentConf.controlledLands[houseIndex][i].units, function (unitIndex, unit) {
               units += unit;
            });

            if(units === 0) {
                currentConf.controlledLands[houseIndex].splice(i, 1);
            }
        };
    });

    location.hash = $.param(currentConf);
});

//Unlimited add
$('.navContent').on('click', '.placeUnit', function (event) {
    var unitRank = $(event.delegateTarget).find('.newUnit .unitRank').val();
    var land = $(event.delegateTarget).find('.newUnit .land').val();

    var house = $(event.delegateTarget).data('house');
    var occupied = currentConf.controlledLands[house].filter(function ( obj ) {
        if(obj !== undefined && obj.land === land) { return obj }
    });

    if(occupied === 0) {
        occupied.units[unitRank] += 1;
    }else{
        var newUnit =
        {
            'land': land,
            'order': false,
            'units':
            {
                'knight': 0,
                'footman': 0,
                'ship': 0,
                'powertoken': 0
            }
        };
        $.each(currentConf.controlledLands, function (index, house) {
            $.each(house, function (landIndex, landObj){
                if(landObj.land === land) {
                    currentConf.controlledLands[house][landIndex].splice(landIndex, 1);
                }
            });
        });

        newUnit.units[unitRank] += 1;
        currentConf.controlledLands[house].push(newUnit);
    }
    location.hash = $.param(currentConf);
});

// setting hash on form change
$('.navContent .updateBoard :input').on('change', function () {
    location.hash = hash;
});

// setting board and form on hash change
$(window).on('hashchange', function () {
    var hash = location.hash;
    if (hash.indexOf('#') === 0) {
        hash = hash.substr(1);
    }
    try {
        currentConf = $.deparam(hash);
        console.log('Hased on change');

    } catch (e) {
        console.log(e);
        console.log('failed to apply new settings');
    }
    setBoard(currentConf);
    setShortLink(location.href);
});
// click listener for powertoken change
$('body').on('click', '.availablePowertokens', function (e) {
    var house = $(this).data('house');
    var tokens = $(this).data('tokens');
    currentConf.powertokens[house] = tokens+1;
    location.hash = $.param(currentConf);
});
$('body').on('click','.leftPowertokens', function (e) {
    var house = $(this).data('house');
    var tokens = $(this).data('tokens');
    currentConf.powertokens[house] = tokens-1;
    location.hash = $.param(currentConf);
});

$('.housecards').on('click', 'input', function (event) {
    var house = $(this).data('house');
    var card = $(this).data('card');
    var used = (currentConf.housecards[house][card].used === 'true');
    currentConf.housecards[house][card].used = !used;
    location.hash = $.param(currentConf);
});


    // var $target = $(e.target);
    // if ($target.hasClass('availablePowertokens')) {
        // e.preventDefault();
        // var $input = $('[name="available' + $target.parent().attr('class').replace(/.*powertoken-([^ ]*)/, 'Powertokens-\$1') + '"]');
        // $input.val($input.val() - 1)
    //         .trigger('change');
    // } else if ($target.hasClass('leftPowertokens')) {
    //     e.preventDefault();
    //     var $input = $('[name="available' + $target.parent().attr('class').replace(/.*powertoken-([^ ]*)/, 'Powertokens-\$1') + '"]');
    //     $input.val(+$input.val() + 1)
    //         .trigger('change');
    // } else if ($target.hasClass('vsb-token')) {
    //     e.preventDefault();
    //     var $input = $('[name="vsb-used"]');
    //     $input.attr('checked', !$target.hasClass('used'))
    //         .trigger('change');
    // } else if ($target.hasClass('raven-token')) {
    //     e.preventDefault();
    //     var $input = $('[name="raven-used"]');
    //     $input.attr('checked', !$target.hasClass('used'))
    //         .trigger('change');
    // }
});
