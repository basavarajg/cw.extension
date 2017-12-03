let result1 = [ '(<a href="/en-US/docs/Web/CSS">CSS</a>) or functionality/behavior (<a href="/en-US/docs/Web/JavaScript">JavaScript</a>).',
  '(<a href="/en-US/docs/Web/CSS">CSS</a>) or functionality/behavior (<a href="/en-US/docs/Web/JavaScript">JavaScript</a>).',
  '(<a href="/en-US/docs/Web/CSS">CSS</a>) or functionality/behavior (<a href="/en-US/docs/Web/JavaScript">JavaScript</a>).',
  ' <a href="/en-US/docs/Web/HTML/Element/head" title="The HTML <head> element provides general information (metadata) about the document, including its title and links to its&nbsp;scripts and style sheets."><code>&lt;head&gt;</code></a>, <a href="/en-US/docs/Web/HTML/Element/title" title="The HTML <title> element defines the title of the document, shown in a browser\'s title bar or on the page\'s tab. It can only contain text, and any contained tags are ignored."><code>&lt;title&gt;</code></a>',
  'MathML element reference',
  'Details',
  'MathML attributes',
  ' <a href="/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties">enumerable properties</a>',
  ' <a href="/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties">enumerable properties</a>' ];

  let result = JSON.stringify(result1);
  let array = JSON.parse(result);
  for(let i=0; i< array.length; i++) {
    if(undefined != array[i]
      && null != array[i]
      && '' != array[i])
      console.log(array[i]);
  }
