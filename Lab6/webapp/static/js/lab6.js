$(document).ready(function() {
  /* intercept the incoming states from SSE */
    iotSource.onmessage = function(e) {
      var double_quote_formatted_data = e.data.replace(/'/g, '"');
      parsed_data = JSON.parse(double_quote_formatted_data);
      // console.log(parsed_data);
      clearEnvTables();
      clearInertialTables();

      updateEnvironmentalTableData(parsed_data);
      updateInertialTableData(parsed_data);
      updateEnvironChartData(parsed_data);
      updateInertialChart(parsed_data);
  }

//Glabal arrays to capture the table data
var env_table_data = [];
var imu_table_data = [];
var env_chart_data = [];
var ine_chart_data = [];

//====================Environment table functions=============================
function updateEnvironmentalTableData(json_obj) {
  env_table_data.push(json_obj);
  if(env_table_data.length >4) {
    env_table_data.shift();
    clearEnvTables();
  }
  updateEnvironmentalTable(env_table_data);

}

// Updates the Environment table data
function updateEnvironmentalTable(data) {
  $('tr.env-param-row').each(function(i) {
    var tm = '<td>' + data[i]['timestamp'] + '</td>';
    var t  = '<td>' + data[i]['environmental']['temperature'].value.toFixed(2) + '</td>';
    var p  = '<td>' + data[i]['environmental']['pressure'].value.toFixed(2) + '</td>';
    var h  = '<td>' + data[i]['environmental']['humidity'].value.toFixed(2) + '</td>';
    $(this).append(tm);
    $(this).append(t);
    $(this).append(p);
    $(this).append(h);

  });
}


// ===============Intertial table functions======================================
function updateInertialTableData(json_obj) {
  imu_table_data.push(json_obj);
  if(imu_table_data.length >4) {
    imu_table_data.shift();
    clearInertialTables();
  }
  updateInertialTable(imu_table_data);
}

function updateInertialTable(data) {
  $('tr.imu-param-row').each(function(i) {
    var tm = '<td>' + data[i]['timestamp'] + '</td>';
    var x  = '<td>' + data[i]['inertial']['accelerometer']['x'].toFixed(2) + '</td>';
    var y  = '<td>' + data[i]['inertial']['accelerometer']['y'].toFixed(2) + '</td>';
    var z  = '<td>' + data[i]['inertial']['accelerometer']['z'].toFixed(2) + '</td>';
    var p  = '<td>' + data[i]['inertial']['orientation']['pitch'].toFixed(1) + '</td>';
    var r  = '<td>' + data[i]['inertial']['orientation']['roll'].toFixed(1) + '</td>';
    var yw = '<td>' + data[i]['inertial']['orientation']['yaw'].toFixed(1) + '</td>';
    var c  = '<td>' + data[i]['inertial']['orientation']['compass'].toFixed(0) + '</td>';
    $(this).append(tm);
    $(this).append(x);
    $(this).append(y);
    $(this).append(z);
    $(this).append(p);
    $(this).append(r);
    $(this).append(yw);
    $(this).append(c);
  });
}
//================= Functions to clear the tables==================================

// Clears the Environment table
function clearEnvTables() {
  $('tr.env-param-row').each(function(i) {
    $(this).empty();
    // console.log("Env",i);
  });
}

//Clear Inertial table
function clearInertialTables() {
  $('tr.imu-param-row').each(function(i) {
    $(this).empty();
  });
}

//======================Env Chart Data =========================================
var env_chart = new Morris.Line({
  element: 'env-chart',
  data:[
  ],
  xkey: 'time',
  ykeys:['h'],
  labels:['%RH']
});

//build the chart data
function updateEnvironChartData (json_obj) {
  env_chart_data.push(json_obj);
  if (env_chart_data.length >16) {
    env_chart_data.shift();
  }
  updateEnvironChart(env_chart_data);
}

//update the Chart
function updateEnvironChart(data) {
  var chart_data = [];
  data.forEach(function(d) {
    env_record = {
      time: d['timestamp'],
      h: d['environmental']['humidity'].value.toFixed(2)
    };
    chart_data.push(env_record);
    // console.log(env_record);
  });
  // console.log(env_chart);
  env_chart.setData(chart_data);
}

// =============Inertial Data Chart=============================================
var inr_chart = new Morris.Line({
  element: 'accel-chart',
  data:[
  ],
  xkey: 'time',
  ykeys:['x', 'y','z'],
  labels:['Accel-X','Accel-Y','Accel-Z']
});

function updateInertialChart(json_obj) {
  ine_chart_data.push(json_obj);

  if(ine_chart_data.length > 16) {
    ine_chart_data.shift();
    }
  updateInertialChartData(ine_chart_data);
}

function updateInertialChartData(data) {
  var iner_chart_data = [];
  data.forEach(function(d) {
    ine_record = {
      time : d['timestamp'],
      x : d['inertial']['accelerometer']['x'].toFixed(2),
      y : d['inertial']['accelerometer']['y'].toFixed(2),
      z : d['inertial']['accelerometer']['z'].toFixed(2)
    }
    iner_chart_data.push(ine_record);
  });
  inr_chart.setData(iner_chart_data);
}
});
