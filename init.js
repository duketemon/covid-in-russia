function beautifyNumber(number) {
    if (number >= 1000) {
        var s = number.toString();
        return s.slice(0, s.length-3) + ' ' + s.slice(s.length-3);
    }
    return number.toString();
}

var position = STATS_DATA["Россия"]["infected"].length-1;
$('#infected-number')[0].innerText = beautifyNumber(STATS_DATA["Россия"]["infected"][position]);
$('#healed-number')[0].innerText = beautifyNumber(STATS_DATA["Россия"]["healed"][position]);
$('#died-number')[0].innerText = beautifyNumber(STATS_DATA["Россия"]["died"][position]);

new_infected_cases = STATS_DATA["Россия"]["infected"][position] - STATS_DATA["Россия"]["infected"][position-1];
if (new_infected_cases >= 0) {
    new_infected_cases = '+' + beautifyNumber(new_infected_cases);
}

new_healed_cases = STATS_DATA["Россия"]["healed"][position] - STATS_DATA["Россия"]["healed"][position-1];
if (new_healed_cases >= 0) {
    new_healed_cases = '+' + beautifyNumber(new_healed_cases);
}

new_died_cases = STATS_DATA["Россия"]["died"][position] - STATS_DATA["Россия"]["died"][position-1];
if (new_died_cases >= 0) {
    new_died_cases = '+' + beautifyNumber(new_died_cases);
}

$('#new-infected-cases')[0].innerText = new_infected_cases;
$('#new-healed-cases')[0].innerText = new_healed_cases;
$('#new-died-cases')[0].innerText = new_died_cases;


$(function() {
    $("#subjects-list").autocomplete({
        source: function(request, response) {
                    var results = $.ui.autocomplete.filter(RF_SUBJECTS, request.term);
                    response(results.slice(0, 10));
                }
    });
});
