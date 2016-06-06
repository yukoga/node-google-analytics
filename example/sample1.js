var ga = require('../lib/universal-analytics')
;

var gaTracker = new ga('UA-48400818-4');
gaTracker.setHitCallback(function(data){
  console.log('This is callback. : ' + data);
});
gaTracker.sendPageview('/node-js-sample');
gaTracker.sendPageview('/node-js-sample', 'This is a sample.');
gaTracker.sendEvent('test-event-category', 'send-interactive', 'interactive', 1000, 0);
gaTracker.sendEvent('test-event-category', 'send-non-interactive', 'non-interactive', 2000, 1);
