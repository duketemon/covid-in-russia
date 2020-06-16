updateGeneralStats("Россия");

// Upload data for the list of subjects
$(function() {
    $("#subjects-list").autocomplete({
        source: function(request, response) {
                    var results = $.ui.autocomplete.filter(RF_SUBJECTS, request.term);
                    response(results.slice(0, 10));
                }
    });
});


// Init the world values
let worldTotalInfectedNumber = parseInt("8044683");
let worldTotalInfectedNumberUplift = parseInt("121176");

let worldTotalHealedNumber = parseInt("3883243");
let worldTotalHealedNumberUplift = parseInt("94880");

let worldTotalDiedNumber = parseInt("437131");
let worldTotalDiedNumberUplift = parseInt("3446");

let worldCurrentInfectedNumber = worldTotalInfectedNumber - worldTotalHealedNumber - worldTotalDiedNumber;
let worldCurrentInfectedNumberUplift = worldTotalInfectedNumberUplift - worldTotalHealedNumberUplift - worldTotalDiedNumberUplift;


$('#world-total-infected-number')[0].innerText = `${beautifyNumber(worldTotalInfectedNumber)} (${beautifyNumberWithSign(worldTotalInfectedNumberUplift)})`;
$('#world-current-infected-number')[0].innerText = `${beautifyNumber(worldCurrentInfectedNumber)} (${beautifyNumberWithSign(worldCurrentInfectedNumberUplift)})`;
$('#world-total-healed-number')[0].innerText = `${beautifyNumber(worldTotalHealedNumber)} (${beautifyNumberWithSign(worldTotalHealedNumberUplift)})`;
$('#world-total-died-number')[0].innerText = `${beautifyNumber(worldTotalDiedNumber)} (${beautifyNumberWithSign(worldTotalDiedNumberUplift)})`;
let mortality = 100 * worldTotalDiedNumber / (worldTotalHealedNumber + worldTotalDiedNumber)
$('#world-mortality-number')[0].innerText = mortality.toFixed(2) + `%`;


// Init some highest metrics for the whole Russia
let highestMortalityValues = getHighestMortalitySubject();
$('#highest-mortality-subject')[0].innerText = highestMortalityValues[0];
$('#highest-mortality-subject-value')[0].innerText = (100 * highestMortalityValues[1]).toFixed(2);

let highestInfectedUpliftValues = getHighestInfectedUplift();
$('#highest-infected-uplift-subject')[0].innerText = highestInfectedUpliftValues[0];
$('#highest-infected-uplift-subject-value')[0].innerText = highestInfectedUpliftValues[1];
