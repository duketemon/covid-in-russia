function beautifyNumber(number) {
    if (number >= 1000) {
        var s = number.toString();
        return s.slice(0, s.length-3) + ' ' + s.slice(s.length-3);
    }
    return number.toString();
}

function beautifyNumberWithSign(number) {
    if (number > 0) {
        return '+' + beautifyNumber(number);
    }
    return beautifyNumber(number);
}


let lastDayPosition = STATS_DATA["Россия"]["infected"].length-1;
let lastDayTotalHealedNumber = STATS_DATA["Россия"]["healed"][lastDayPosition];
let lastDayTotalDiedNumber = STATS_DATA["Россия"]["died"][lastDayPosition];
let lastDayTotalInfectedNumber = STATS_DATA["Россия"]["infected"][lastDayPosition];
let lastDayCurrentInfectedNumber = lastDayTotalInfectedNumber - lastDayTotalHealedNumber - lastDayTotalDiedNumber;

$('#total-infected-number')[0].innerText = beautifyNumber(lastDayTotalInfectedNumber);
$('#current-infected-number')[0].innerText = beautifyNumber(lastDayCurrentInfectedNumber);
$('#total-healed-number')[0].innerText = beautifyNumber(lastDayTotalHealedNumber);
$('#total-died-number')[0].innerText = beautifyNumber(lastDayTotalDiedNumber);


let lastDayTotalInfectedNumberUplift = lastDayTotalInfectedNumber - STATS_DATA["Россия"]["infected"][lastDayPosition-1];
let lastDayTotalHealedNumberUplift = lastDayTotalHealedNumber - STATS_DATA["Россия"]["healed"][lastDayPosition-1];
let lastDayTotalDiedNumberUplift = lastDayTotalDiedNumber - STATS_DATA["Россия"]["died"][lastDayPosition-1];
let lastDayCurrentInfectedNumberUplift = lastDayTotalInfectedNumberUplift - lastDayTotalHealedNumberUplift - lastDayTotalDiedNumberUplift;


$('#total-infected-uplift')[0].innerText = beautifyNumberWithSign(lastDayTotalInfectedNumberUplift);
$('#current-infected-uplift')[0].innerText = beautifyNumberWithSign(lastDayCurrentInfectedNumberUplift);
$('#total-healed-uplift')[0].innerText = beautifyNumberWithSign(lastDayTotalHealedNumberUplift);
$('#total-died-uplift')[0].innerText = beautifyNumberWithSign(lastDayTotalDiedNumberUplift);


$(function() {
    $("#subjects-list").autocomplete({
        source: function(request, response) {
                    var results = $.ui.autocomplete.filter(RF_SUBJECTS, request.term);
                    response(results.slice(0, 10));
                }
    });
});
