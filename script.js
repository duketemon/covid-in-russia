RF_SUBJECTS.forEach(subject => {
    $('#subjects-menu').append(`<a class="dropdown-item" href="#" onclick="updateStatsData(this)">${subject}</a>`)
});

position = STATS_DATA["Россия"]["infected"].length-1;
$('#infected-number')[0].innerText = STATS_DATA["Россия"]["infected"][position];
$('#healed-number')[0].innerText = STATS_DATA["Россия"]["healed"][position];
$('#died-number')[0].innerText = STATS_DATA["Россия"]["died"][position];

new_infected_cases = STATS_DATA["Россия"]["infected"][position] - STATS_DATA["Россия"]["infected"][position-1];
if (new_infected_cases >= 0) {
    new_infected_cases = '+' + new_infected_cases.toString();
}

new_healed_cases = STATS_DATA["Россия"]["healed"][position] - STATS_DATA["Россия"]["healed"][position-1];
if (new_healed_cases >= 0) {
    new_healed_cases = '+' + new_healed_cases.toString();
}

new_died_cases = STATS_DATA["Россия"]["died"][position] - STATS_DATA["Россия"]["died"][position-1];
if (new_died_cases >= 0) {
    new_died_cases = '+' + new_died_cases.toString();
}

$('#new-infected-cases')[0].innerText = new_infected_cases;
$('#new-healed-cases')[0].innerText = new_healed_cases;
$('#new-died-cases')[0].innerText = new_died_cases;


google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);


var statsChartOptions = {
    title: '',
    curveType: 'function',
    legend: { position: 'bottom' },
    pointSize: 10,
    series: {
        0: { color: '#d50000', lineWidth: 6 },
        1: { color: '#ffd600', lineWidth: 6 },
        2: { color: '#212121', lineWidth: 6 },
    }
};

function generateStatsChartData(subject_name) {
    var raw_data = STATS_DATA[subject_name];
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Дата');
    data.addColumn('number', 'Количество заболевших');
    data.addColumn('number', 'Количество выздоровивших');
    data.addColumn('number', 'Количество умерших');
    for(var i=0; i<raw_data["dates"].length; i++) {
        values = raw_data["dates"][i].split('.');
        data.addRow([
            values[2] + '.' + values[1],
            raw_data["infected"][i],
            raw_data["healed"][i],
            raw_data["died"][i]
        ]);
    }
    return data;
}

function drawChart() {
    var data = generateStatsChartData("Россия");
    chart = new google.visualization.LineChart(document.getElementById('stats-chart'));
    chart.draw(data, statsChartOptions);
}

function updateStatsData(obj) {
    var subject_name = obj.innerText;
    var data = generateStatsChartData(subject_name);
    chart.draw(data, statsChartOptions);
}
