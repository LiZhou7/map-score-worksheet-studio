function doPost(e) {
  var payload = JSON.parse(e.postData.contents);
  var form = FormApp.create(payload.title || 'Reading Quiz');
  form.setIsQuiz(true);
  form.addTextItem().setTitle('Student name').setRequired(true);
  form.addSectionHeaderItem().setTitle(payload.passage.title).setHelpText(payload.passage.body.join('\n\n'));

  (payload.questions || []).forEach(function (item) {
    var prompt = item.prompt || '';
    var lines = prompt.split('\n');
    var choices = lines.filter(function (line) { return /^[A-D]\. /.test(line); });
    if (choices.length >= 2) {
      var question = form.addMultipleChoiceItem();
      question.setTitle(lines[0]);
      question.setChoices(choices.map(function (choice, index) {
        return question.createChoice(choice.replace(/^[A-D]\. /, ''), index === 0);
      }));
      question.setRequired(true);
    } else {
      form.addParagraphTextItem().setTitle(prompt).setRequired(true);
    }
  });

  form.addParagraphTextItem()
    .setTitle('What is one skill you practiced today, and what evidence did you use?')
    .setRequired(true);

  return ContentService
    .createTextOutput(JSON.stringify({ editUrl: form.getEditUrl(), publishedUrl: form.getPublishedUrl() }))
    .setMimeType(ContentService.MimeType.JSON);
}
