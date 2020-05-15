var statsByDaysChartOptions = {
    title: 'Статистика по дням',
    curveType: 'function',
    legend: { position: 'bottom' },
    pointSize: 8,
    chartArea: {'height': '80%', 'width': '90%'},
    annotations: {
        style: 'line'
    },
    vAxis: {
        viewWindowMode:'explicit',
        viewWindow: {
            min:0
        },
        textStyle : {
            fontSize: 12,
            color: "#999999"
        }
    },
    hAxis: {
        textStyle : {
            fontSize: 12,
            color: "#999999"
        }
    },
    series: {
        0: { color: '#d50000', lineWidth: 5 },
        1: { color: '#00c853', lineWidth: 5 },
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

special_dates = {
    "30.03": ["Начало нерабочих дней", "Начался единый период нерабочих дней"],
    "12.05": ["Конец нерабочих дней", "Завершился единый период нерабочих дней"],
}

function generateStatsByDaysChart(subject_name) {
    statsByDaysChartOptions['title'] = `Статистика по дням (${subject_name})`;
    var raw_data = STATS_DATA[subject_name];
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Дата');
    data.addColumn({type: 'string', role: 'annotation'});
    data.addColumn({type: 'string', role: 'annotationText'});
    data.addColumn('number', 'Количество заражённых');
    data.addColumn('number', 'Количество выздоровивших');
    data.addColumn('number', 'Количество умерших');
    for(var i=0; i<raw_data["dates"].length; i++) {
        values = raw_data["dates"][i].split('.');
        date = values[2] + '.' + values[1];
        if (date in special_dates) {
            annotation = special_dates[date][0];
            annotationText = special_dates[date][1];
        }
        else{
            annotation = null;
            annotationText = null;
        }

        data.addRow([
            date,
            annotation,
            annotationText,
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
