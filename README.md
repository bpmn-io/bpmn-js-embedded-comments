# Comments for bpmn-js

This project adds the ability create comments on elements to [bpmn-js](https://github.com/bpmn-io/bpmn-js).

An integration of the plug-in into a bpmn-js powered process diagram viewer may look like this:

![A screenshot of a comments integration](https://raw.githubusercontent.com/bpmn-io/bpmn-js-embedded-comments/master/docs/screenshot.png)


## How comments are stored

Comments are read, added and written to an elements `<bpmn:documentation textFormat="text/x-comments" />` tag.

The format for comments is assumed to be

```
author:comment;
;other-author:other comment
canbe multiline, too
```

## How an author is set

The current author can be set as follows

```
var Comments = require('bpmn-js-embedded-comments');

Comments.author.setAuthor('My Name');
```

## License

MIT
