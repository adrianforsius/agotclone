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
        if(conf.controlledLands.tyrell !== undefined) {
            var orderHtml = '';

            $.each(conf.orders.tyrell, function (orderToken, orderLand) {
                orderHtml += '<div class="ordera-select-' + orderToken + ' order">';
                orderHtml += '<label>'+conf.orderTokens[orderToken] +'</label>';
                orderHtml += '<select name="tyrell-order-token" data-house="tyrell" data-token="'+orderToken+'" class="token">';
                orderHtml += '<option value="">---</option>';

                $.each(conf.controlledLands.tyrell, function (landIndex, landName) {
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
        $('.tyrell-controls .orders').html(orderHtml);
        

        var unitHtml = '';
        unitHtml += '<select name="tyrell-new-unit-land" class="land"><option value="">---</option>';
        $.each(conf.lands, function (landIndex, land){
            unitHtml += '<option value="'+ land.land +'">'+ land.land +'</option>';
        });
        unitHtml += '</select>';
        unitHtml += '<select name="tyrell-new-unit-rank" class="unitRank"><option value="">---</option>';
        $.each(conf.units, function (unit, value) {
            unitHtml += '<option value="'+ unit +'">'+ unit +'</option>';
        });
        unitHtml += '</select>';
        $('.tyrell-controls .newUnit').html(unitHtml);


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
        htmlString += '<div class="vsb-token ' + (conf.vsbUsed ? 'used' : 'unused') + '"></div>';
        htmlString += '<div class="raven-token ' + (conf.ravenUsed ? 'used' : 'unused') + '"></div>';
        // Units

        $.each(conf.controlledLands, function (houseIndex, house) {
            //is house alive?
            if(house !== undefined) {
                $.each(house, function (landIndex, land) {
                    $.each(land.units, function (unit, count) {
                        if(count > 0) {
                            htmlString += '<div class="' + unit + '-' + houseIndex + ' pos-' + land.land + ' unit"><div class="remove"></div></div>';
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

        // $.each(conf.powertokens, function (house, count) {
        //     htmlString += '<div class="tokenCounts-' + house + ' powertoken-' + house + '">';
        //     // available Power Tokens
        //     htmlString += '<div class="availablePowertokens">';
        //     htmlString += count
        //     htmlString += '</div>';
        //     // left Power Tokens
        //     htmlString += '<div class="leftPowertokens">';
        //     htmlString += conf.max.powertokens - count;
        //     htmlString += '</div>';
        //     htmlString += '</div>';
        // });

        // housecard tracking
        // for(var house in conf.housecards) {
        //     var housecards = conf.housecards[house].split('\n');
        //     for (var i = 0; i < housecards.length; i += 1) {
        //         $('[name="housecard-' + i + '-' + house + '"] + label').html(housecards[i]);
        //     }
        // }
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
$('body').on('click', function (e) {
    var $target = $(e.target);
    if ($target.hasClass('availablePowertokens')) {
        e.preventDefault();
        var $input = $('[name="available' + $target.parent().attr('class').replace(/.*powertoken-([^ ]*)/, 'Powertokens-\$1') + '"]');
        $input.val($input.val() - 1)
            .trigger('change');
    } else if ($target.hasClass('leftPowertokens')) {
        e.preventDefault();
        var $input = $('[name="available' + $target.parent().attr('class').replace(/.*powertoken-([^ ]*)/, 'Powertokens-\$1') + '"]');
        $input.val(+$input.val() + 1)
            .trigger('change');
    } else if ($target.hasClass('vsb-token')) {
        e.preventDefault();
        var $input = $('[name="vsb-used"]');
        $input.attr('checked', !$target.hasClass('used'))
            .trigger('change');
    } else if ($target.hasClass('raven-token')) {
        e.preventDefault();
        var $input = $('[name="raven-used"]');
        $input.attr('checked', !$target.hasClass('used'))
            .trigger('change');
    }
});
});