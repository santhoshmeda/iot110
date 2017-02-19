$(document).ready(function() {
  /* intercept the incoming states from SSE */
    iotSource.onmessage = function(e) {
      var double_quote_formatted_data = e.data.replace(/'/g, '"');
      parsed_data = JSON.parse(double_quote_formatted_data);
      console.log(parsed_data);
      clearEnvTables();
      clearInertialTables();

      updateEnvironmentalTableData(parsed_data);
      updateInertialTableData(parsed_data);
  }

//Glabal arrays to capture the table data
var env_table_data = [];
var imu_table_data = [];

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

});

//======================Env Chart Data =========================================
var env_chart = new Morris.line({
  
})
