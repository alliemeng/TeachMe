function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var skills = {
    'Ruby': {"name": "Ruby", "suggestedPoints": rand(10, 20), "upvotes": rand(15, 25), "image": "https://cdn.tutsplus.com/net/uploads/legacy/417_ruby/images/ruby.png"},
    'iOS': {"name": "iOS", "suggestedPoints": rand(15, 25), "upvotes": rand(5, 13), "image": "https://upload.wikimedia.org/wikipedia/en/0/0c/Xcode_icon.png"},
    'Javascript': {"name": "Javascript", "suggestedPoints": rand(9, 17), "upvotes": rand(10, 15), "image": "http://cursohtml5js.com/js.png"},
    'C': {"name": "C", "suggestedPoints": rand(18, 25), "upvotes": rand(5, 14), "image": "http://41.media.tumblr.com/ec1e2865d914521ded388fbcc447791c/tumblr_inline_nu6vqczp8y1tbt8rv_400.png"},
    'Lifting': {"name": "Lifting", "suggestedPoints": rand(10, 20), "upvotes": rand(5, 10), "image": "http://www.teleread.com/wp-content/uploads/2013/03/barbell.jpg"},
    'Logic': {"name": "Logic", "suggestedPoints": rand(12, 22), "upvotes": rand(10, 13), "image": "http://funbuzzindia.com/wp-content/uploads/2014/11/Logical-Thinking-Head.jpg"},
    'Looking good': {"name": "Looking good", "suggestedPoints": rand(10, 15), "upvotes": rand(3, 8), "image": "http://www.imprevu.us/wp-content/uploads/2015/10/Fashion-And-Modern-Youth.jpg"},
    'Designing': {"name": "Designing", "suggestedPoints": rand(15, 25), "upvotes": rand(5, 15), "image": "http://ecx.images-amazon.com/images/I/51jxBzU40uL._SL1000_.jpg"},
    'Trolling': {"name": "Trolling", "suggestedPoints": rand(5, 15), "upvotes": rand(60, 70), "image": "http://img3.wikia.nocookie.net/__cb20120826123355/vssaxtonhale/images/c/c2/Troll-face.png"}
};

var people = [
    {'name': 'Feifan Zhou', 'skills': ['Ruby', 'iOS', 'Javascript', 'C'], 'location': [41.3144767, -72.9306981], 'imageID': '100001324728942'},
    {'name': 'Allie Meng', 'skills': ['Lifting', 'Logic', 'Looking good'], 'location': [41.3098349, -72.9275223], 'imageID': '1206565055'},
    {'name': 'Haroon Ismail', 'skills': ['Designing', 'Trolling', 'Looking good'], 'location': [38.8812203, -77.0404873], 'imageID': '1313413656'}
];

var output = '';
people.forEach(function(person, personIndex) {
    output += '{' + "\n";
    output += '"name": "' + person.name + '",' + "\n";
    output += '"skills": [' + "\n";
    person.skills.forEach(function(skillName, index) {
	skill = skills[skillName];
	var skillKeys = Object.keys(skill);
	var skillOutput = skillKeys.map(function(key) { return '"' + key + '": "' + skill[key] + '"' });
	output += '{' + skillOutput.join(', ') + '}';
	if (index < (person.skills.length - 1))
	    output += ',';
	output += "\n";
    });
    output += '],' + "\n";
    output += '"imageID": "' + person.imageID + '",' + "\n";
    output += '"lastLoc": {' + "\n";
    output += '"type": "Point",' + "\n";
    output += '"coordinates": [' + person.location[0] + ', ' + person.location[1] + ']' + "\n";
    output += '}' + "\n";
    output += '}';
    if (personIndex < (people.length - 1))
	output += ',';
    output += "\n";
});
output = '[' + output + ']';

var fs = require('fs');
fs.writeFile('./seed.json', output, function(error) {
    console.log('Error writing file: ' + error);
});
