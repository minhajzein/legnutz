var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
    matches = [];
    substrRegex = new RegExp(q, 'i');
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });
    cb(matches);
  };
};


var states = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: [
            {'name':'WOMEN PINK SHIRT', 'image': '../assets/images/fashion/product/1.jpg', 'price':'$250'}, 
            {'name':'Apple Phones', 'image': '../assets/images/fashion/product/55.jpg', 'price':'$250'},
            {'name':'Body Lotion', 'image': '../assets/images/fashion/product/56.jpg', 'price':'$250'},
            {'name':'Car Accessories', 'image': '../assets/images/fashion/product/57.jpg', 'price':'$250'},
            {'name':'Drone', 'image': '../assets/images/fashion/product/16.jpg', 'price':'$250'},
            {'name':'Earpods', 'image': '../assets/images/fashion/product/17.jpg', 'price':'$250'},
            {'name':'Face Mask', 'image': '../assets/images/fashion/product/19.jpg', 'price':'$250'},
            {'name':'Gaming Laptop', 'image': '../assets/images/fashion/product/21.jpg', 'price':'$250'},
            {'name':'headphone', 'image': '../assets/images/fashion/product/25.jpg', 'price':'$250'},
            {'name':'iphone', 'image': '../assets/images/fashion/product/13.jpg', 'price':'$250'},
            ]
    });

    states.initialize();


$('.the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'states',
  display: 'name',
  source: states.ttAdapter(),
  templates: {
    empty: [
      '<div class="empty-message">',
        'No Record Found !',
      '</div>'
    ].join('\n'),
    suggestion: function (data) {
        return '<a href="product-page.html" class="man-section"><div class="image-section"><img src='+data.image+'></div><div class="description-section"><h4>'+data.name+'</h4><span>'+data.price+'</span></div></a>';
    }
  },
});