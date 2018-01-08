var availableDists = {}

listToMenu = function(myList) { 
  if (myList == null) {
    return [];
  }
  return myList.map(function(k) { return {'name': k, 'value': k}})
}


listDists = function() {
    $.getJSON('/distributions', function(data) {
      availableDists = data;

      var menuValues = listToMenu(Object.keys(data));

      menuValues[0]['selected'] = true;

      $('#distType').dropdown({
        values: menuValues,
        onChange: changeDists
      });

    });
};


changeDists = function(val) {
  var menuValues = listToMenu(availableDists[val]);
  if (menuValues.length > 0) {
    menuValues[0]['selected'] = true;
    $('#distName').dropdown({
      values: menuValues,
      onChange: function(val) {
        getSignature(val);
        showDocumentation(val);
      }
    });
  }
}


showDocumentation = function(val) {
  $('#documentation').load('/documentation/' + val, function() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'documentation']);
    $('table.docutils').addClass('ui').addClass('table');
  });
}


getType = function(val) {
  if (val == null || $.type(val) == "string") {
    return "text";
  } else {
    return $.type(val);
  }
}


getSignature = function(val) {
  var input;
  var form = $('#signature').empty();
  var fields = $('<div class="fields"></div>')
  $.getJSON('/signature/' + val, function(data) {
    for (const key in data) {
      const val = data[key];
      fields.append($('<div class="field"><label>' +
        key +
        '</label><input type="' +
        getType(val) +
        '" value=' + 
        val + 
        '>')
      )
    }
    form.append(fields);

  });
}


run = function() {
  listDists();
  $('#distType').change(changeDists);
}

$(document).ready(run);

