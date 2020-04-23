var statsByDaysChartOptions = {
    title: 'Статистика по дням',
    curveType: 'function',
    legend: { position: 'bottom' },
    pointSize: 8,
    vAxis: {
        viewWindowMode:'explicit',
        viewWindow: {
            min:0
        }
    },
    series: {
        0: { color: '#d50000', lineWidth: 5 },
        1: { color: '#ffd600', lineWidth: 5 },
        2: { color: '#212121', lineWidth: 5 },
    }
};

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(() => {
    chart = new google.visualization.LineChart(document.getElementById('stats-chart'));
    buildStatsByDaysChart("Россия");
});

function buildStatsByDaysChart(subject_name) {
    var data = generateStatsByDaysChart(subject_name);
    chart.draw(data, statsByDaysChartOptions);
}

function generateStatsByDaysChart(subject_name) {
    statsByDaysChartOptions['title'] = `Статистика по дням (${subject_name})`;
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


function updateStatsDataHandler(obj) {
    var subject_name = obj.innerText;
    buildStatsByDaysChart(subject_name);
}

function getSubjectIndex(target_subject) {
    target_subject = target_subject.toLowerCase();
    for (let i = 0; i < RF_SUBJECTS.length; i++) {
        if (RF_SUBJECTS[i].toLowerCase() == target_subject) {
            return i;
        }
    }
    return -1;
}

function buildStatsChartHandler() {
    var subject_name = $('#subjects-list')[0].value.trim().toLowerCase();
    var subject_index = getSubjectIndex(subject_name);
    if (subject_index == -1) {
        alert('Введите полное название субъекта');
        return;
    }
    buildStatsByDaysChart(RF_SUBJECTS[subject_index]);
}
