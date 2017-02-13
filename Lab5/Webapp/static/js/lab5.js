$(document).ready(function() {
  // establish global variables for LED status
  var led1;
  var led2;
  var led3;

  // var iotSource = new EventSource("{{ url_for('myData') }}");
  /* intercept the incoming states from SSE */
    iotSource.onmessage = function(e) {
      con_obj = e.data.replace(/'/g, '"');
      d = JSON.parse(con_obj);
    // var params = e.data.split(' ');
    updateSwitch(d["switch"]);
    updateLeds(1, d["red_led"]);
    updateLeds(2, d["grn_led"]);
    updateLeds(3, d["blu_led"]);
    updateSensors(d);
    console.log(d);
  };

  /* update the Switch based on its SSE state monitor */
  function updateSwitch(switchValue) {
    if (switchValue === '1') {
      // $('#switch').text('ON');
      $('#switch').toggleClass('label-success', true);
    } else if (switchValue === '0') {
      $('#switch').toggleClass('label-success', false);
    }
  }

  /* update the LEDs based on their SSE state monitor */
  function updateLeds(ledNum, ledValue) {
    if (ledNum === 1) {
      if (ledValue === '1') {
        $('#red_led_label').toggleClass('label-danger', true);
        // $('#red_led_label').text('ON');
        led1 = "ON";
      } else if (ledValue === '0') {
        $('#red_led_label').toggleClass('label-danger', false);
        // $('#red_led_label').text('OFF');
        led1 = "OFF";
      }
    } else if (ledNum === 2) {
      if (ledValue === '1') {
        $('#grn_led_label').toggleClass('label-success', true);
        // $('#grn_led_label').text('ON');
        led2 = "ON";
      } else if (ledValue === '0') {
        $('#grn_led_label').toggleClass('label-success', false);
        // $('#grn_led_label').text('OFF');
        led2 = "OFF";
      }
    } else if (ledNum === 3) {
      if (ledValue === '1') {
        $('#blu_led_label').toggleClass('label-primary', true);
        // $('#blu_led_label').text('ON');
        led3 = "ON";
      } else if (ledValue === '0') {
        $('#blu_led_label').toggleClass('label-primary', false);
        // $('#blu_led_label').text('OFF');
        led3 = "OFF";
      }
    }
  }


// // make sure to intialize synchronously (10ms back to back)
// initial_conditions().then(led_status);
// The button click functions run asynchronously in the browser
$('#red_led_btn').click(function() {
  if (led1 === "OFF") {
    led1 = "ON";
  } else {
    led1 = "OFF";
  }
  var params = 'led=1&state=' + led1;
  console.log('Led Command with params:' + params);
  $.post('/ledcmd', params, function(data, status) {
    console.log("Data: " + data + "\nStatus: " + status);
  });
});

$('#grn_led_btn').click(function() {
  if (led2 === "OFF") {
    led2 = "ON";
  } else {
    led2 = "OFF";
  }
  var params = 'led=2&state=' + led2;
  console.log('Led Command with params:' + params);
  $.post('/ledcmd', params, function(data, status) {
    console.log("Data: " + data + "\nStatus: " + status);
  });
});

$('#blu_led_btn').click(function() {
  if (led3 === "OFF") {
    led3 = "ON";
  } else {
    led3 = "OFF";
  }
  var params = 'led=3&state=' + led3;
  console.log('Led Command with params:' + params);
  $.post('/ledcmd', params, function(data, status) {
    console.log("Data: " + data + "\nStatus: " + status);
  });
});

MBAR_to_inHG = 0.02953;
var data = [];

function getDateNow() {
  var d = new Date();
  var date = (d.getFullYear()) + '-' + (d.getMonth()) + '-' + (d.getDate());
  var time = (d.getHours()) + ':' + (d.getMinutes()) + ':' + (d.getSeconds());
  return {epoch: time, date: (date + " " + time)};
}

updateSensors = (function (d) {
  var t_c = d["temperature"].reading;
  var p_mbar = d["pressure"].reading;
  var t_f = (t_c * 9.0)/5.0 + 32.0;
  var p_inHg = p_mbar * MBAR_to_inHG;

  var timeData = getDateNow();
  var t = t_c.toFixed(1) + '|' + t_f.toFixed(1);
  var p = p_mbar.toFixed(1) + '|' + p_inHg.toFixed(1);

  var obj = {};
  obj['date'] = timeData.date;
  obj['time'] = timeData.date;
  obj['temp'] = t;
  obj['press'] = p;
  data.push(obj);

  console.log(timeData);
  if(data.length > 5) {
    data.shift();
    clearTable();
    updateTable(data);
    update_temp_chart(data);
  }
});

function updateTable(data) {
  $('tr.param-row').each(function(i) {
    var tm = '<td>' + data[i]['date'] + '</td>';
    var temp = '<td>' + data[i]['temp'] + '</td>';
    var press = '<td>' + data[i]['press'] + '</td>';
    $(this).append(tm);
    $(this).append(temp);
    $(this).append(press);
  });
}

function clearTable() {
  $('tr.param-row').each(function(i){
    $(this).empty();
  });
}

var graph = new Morris.Line({
  element: 'mytempchart',
  data: [],
  xkey: 'time',
  ykeys: ['value'],
  labels: ['Value']
});

function update_temp_chart(data){
  var chart_data = [
    { time: data[0]['time'], value: data[0]['temp'] },
    { time: data[1]['time'], value: data[1]['temp'] },
    { time: data[2]['time'], value: data[2]['temp'] },
    { time: data[3]['time'], value: data[3]['temp'] },
    { time: data[4]['time'], value: data[4]['temp'] }
  ];
  graph.setData(chart_data);

}

});
