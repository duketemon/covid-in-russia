function beautifyNumber(number) {
    var values = [];
    let s = number.toString();
    for (var i=s.length-1; i>=0; i--) {
        if (values.length % 3 == 0) {
            values.push(s[i] + " ");
        }
        else {
            values.push(s[i]);
        }
    }
    return values.reverse().join("").trimEnd();
}

function beautifyNumberWithSign(number) {
    if (number > 0) {
        return '+' + beautifyNumber(number);
    }
    return beautifyNumber(number);
}

function updateGeneralStats(subject) {
    let lastDayPosition = STATS_DATA[subject]["infected"].length-1;
    let lastDayTotalHealedNumber = STATS_DATA[subject]["healed"][lastDayPosition];
    let lastDayTotalDiedNumber = STATS_DATA[subject]["died"][lastDayPosition];
    let lastDayTotalInfectedNumber = STATS_DATA[subject]["infected"][lastDayPosition];
    let lastDayCurrentInfectedNumber = lastDayTotalInfectedNumber - lastDayTotalHealedNumber - lastDayTotalDiedNumber;
    
    let lastDayTotalInfectedNumberUplift = lastDayTotalInfectedNumber - STATS_DATA[subject]["infected"][lastDayPosition-1];
    let lastDayTotalHealedNumberUplift = lastDayTotalHealedNumber - STATS_DATA[subject]["healed"][lastDayPosition-1];
    let lastDayTotalDiedNumberUplift = lastDayTotalDiedNumber - STATS_DATA[subject]["died"][lastDayPosition-1];
    let lastDayCurrentInfectedNumberUplift = lastDayTotalInfectedNumberUplift - lastDayTotalHealedNumberUplift - lastDayTotalDiedNumberUplift;
    
    $('#total-infected-number')[0].innerText = `${beautifyNumber(lastDayTotalInfectedNumber)} (${beautifyNumberWithSign(lastDayTotalInfectedNumberUplift)})`;
    $('#current-infected-number')[0].innerText = `${beautifyNumber(lastDayCurrentInfectedNumber)} (${beautifyNumberWithSign(lastDayCurrentInfectedNumberUplift)})`;
    $('#total-healed-number')[0].innerText = `${beautifyNumber(lastDayTotalHealedNumber)} (${beautifyNumberWithSign(lastDayTotalHealedNumberUplift)})`;
    $('#total-died-number')[0].innerText = `${beautifyNumber(lastDayTotalDiedNumber)} (${beautifyNumberWithSign(lastDayTotalDiedNumberUplift)})`;
    let mortality = 100 * lastDayTotalDiedNumber / (lastDayTotalHealedNumber + lastDayTotalDiedNumber)
    $('#mortality-number')[0].innerText = mortality.toFixed(2) + `%`;
}

