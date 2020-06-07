function beautifyNumber(number) {
    var values = [];
    let s = Math.abs(number).toString();
    for (var i=s.length-1; i>=0; i--) {
        if (values.length % 3 == 0) {
            values.push(s[i] + " ");
        }
        else {
            values.push(s[i]);
        }
    }
    prefix = '';
    if (number < 0) {
        prefix = '-';
    }
    return prefix + values.reverse().join("").trim();
}

function beautifyNumberWithSign(number) {
    if (number > 0) {
        return '+' + beautifyNumber(number);
    }
    return beautifyNumber(number);
}

function getInfectedHealedDiedValuesByDayNumber(subject, dayNumber) {
    return [
        STATS_DATA[subject]["infected"][dayNumber],
        STATS_DATA[subject]["healed"][dayNumber],
        STATS_DATA[subject]["died"][dayNumber]
    ]
}


function updateGeneralStats(subject) {
    let todayPosition = STATS_DATA[subject]["infected"].length-1;
    var values = getInfectedHealedDiedValuesByDayNumber(subject, todayPosition);
    
    let todayTotalInfectedNumber = values[0];
    let todayTotalHealedNumber = values[1];
    let todayTotalDiedNumber = values[2];
    let todayCurrentInfectedNumber = todayTotalInfectedNumber - todayTotalHealedNumber - todayTotalDiedNumber;

    var values = getInfectedHealedDiedValuesByDayNumber(subject, todayPosition-1);
    let totalInfectedUplift = todayTotalInfectedNumber - values[0];
    let totalHealedUplift = todayTotalHealedNumber - values[1];
    let totalDiedUplift = todayTotalDiedNumber - values[2];
    let currentInfectedUplift = totalInfectedUplift - totalHealedUplift - totalDiedUplift;
    
    $('#total-infected-number')[0].innerText = `${beautifyNumber(todayTotalInfectedNumber)} (${beautifyNumberWithSign(totalInfectedUplift)})`;
    $('#current-infected-number')[0].innerText = `${beautifyNumber(todayCurrentInfectedNumber)} (${beautifyNumberWithSign(currentInfectedUplift)})`;
    $('#total-healed-number')[0].innerText = `${beautifyNumber(todayTotalHealedNumber)} (${beautifyNumberWithSign(totalHealedUplift)})`;
    $('#total-died-number')[0].innerText = `${beautifyNumber(todayTotalDiedNumber)} (${beautifyNumberWithSign(totalDiedUplift)})`;
    let mortality = 100 * todayTotalDiedNumber / (todayTotalHealedNumber + todayTotalDiedNumber);
    $('#mortality-number')[0].innerText = mortality.toFixed(2) + `%`;
}


function getHighestInfectedUplift() {
    var subject = '';
    var value = -1;
    RF_SUBJECTS.forEach(subj => {
        let todayPosition = STATS_DATA[subj]["infected"].length-1;
        var values = getInfectedHealedDiedValuesByDayNumber(subj, todayPosition);
        let todayTotalInfectedNumber = values[0];
        let todayTotalHealedNumber = values[1];
        let todayTotalDiedNumber = values[2];
    
        var values = getInfectedHealedDiedValuesByDayNumber(subj, todayPosition-1);
        let totalInfectedUplift = todayTotalInfectedNumber - values[0];
        let totalHealedUplift = todayTotalHealedNumber - values[1];
        let totalDiedUplift = todayTotalDiedNumber - values[2];
        let currentInfectedUplift = totalInfectedUplift - totalHealedUplift - totalDiedUplift;
        if (currentInfectedUplift > value) {
            value = currentInfectedUplift;
            subject = subj;
        }
    });
    return [subject, value];
}


function getHighestMortalitySubject() {
    var subject = '';
    var value = -1;
    RF_SUBJECTS.forEach(subj => {
        let lastDayPosition = STATS_DATA[subj]["infected"].length-1;
        let died = STATS_DATA[subj]["died"][lastDayPosition];
        let healed = STATS_DATA[subj]["healed"][lastDayPosition];
        let cur_value = died / (healed+died);
        if (cur_value > value) {
            value = cur_value;
            subject = subj;
        }
    });
    return [subject, value];
}

