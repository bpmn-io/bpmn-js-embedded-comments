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

## License

MIT
