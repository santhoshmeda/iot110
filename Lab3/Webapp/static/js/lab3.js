$(document).ready(function() {
  // establish global variables for LED status
  var led1;
  var led2;
  var led3;

  //  var iotSource = new EventSource("{{ url_for('myData') }}");
  /* intercept the incoming states from SSE */
  iotSource.onmessage = function(e) {
    var params = e.data.split(' ');
    updateSwitch(params[0]);
    updateLeds(1, params[1]);
    updateLeds(2, params[2]);
    updateLeds(3, params[3]);
    console.log(e.data);
  };

  /* update the Switch based on its SSE state monitor */
  function updateSwitch(switchValue) {
    if (switchValue === '1') {
      $('#switch').text('ON');
    } else if (switchValue === '0') {
      $('#switch').text('OFF');
    }
  }

  /* update the LEDs based on their SSE state monitor */
  function updateLeds(ledNum, ledValue) {
    if (ledNum === 1) {
      if (ledValue === '1') {
        $('#red_led_label').toggleClass('default-danger', true);
        // $('#red_led_label').text('ON');
        led1 = "ON";
      } else if (ledValue === '0') {
        $('#red_led_label').toggleClass('default-danger', false);
        // $('#red_led_label').text('OFF');
        led1 = "OFF";
      }
    } else if (ledNum === 2) {
      if (ledValue === '1') {
        // $('#grn_led_label').toggleClass('default-success', true);
        $('#grn_led_label').text('ON');
        led2 = "ON";
      } else if (ledValue === '0') {
        // $('#grn_led_label').toggleClass('default-success', false);
        $('#grn_led_label').text('OFF');
        led2 = "OFF";
      }
    } else if (ledNum === 3) {
      if (ledValue === '1') {
        // $('#blu_led_label').toggleClass('default-primary', true);
        $('#blu_led_label').text('ON');
        led3 = "ON";
      } else if (ledValue === '0') {
        // $('#blu_led_label').toggleClass('default-primary', false);
        $('#blu_led_label').text('OFF');
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

});
